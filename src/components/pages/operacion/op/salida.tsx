import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useProducts, useSalidas, useAreas } from "@/hooks"; // Asegúrate de importar correctamente los hooks
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { createMovimiento, Movimiento } from "@/services/operacion.service";
import { useAuthStore } from "@/store/authStore";
import { convertTimestampToDetailedDate } from "@/util/format-date";
import { Area } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Definir el esquema de validación con Yup
const schema = yup.object().shape({
  producto: yup.string().required("El producto es obligatorio"),
  cantidad: yup
    .number()
    .required("La cantidad es obligatoria")
    .positive("La cantidad debe ser un número positivo")
    .integer("La cantidad debe ser un número entero"),
  tiendaOrigen: yup.string().required("La tienda origen es obligatoria"),
  observations: yup.string(),
});

export default function SalidaOperations() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts();
  const {
    data: salidas,
    isLoading: salidasLoading,
    error: salidasError,
  } = useSalidas();

  const { user } = useAuthStore();

  const {
    data: areas,
    isLoading: areasLoading,
    error: areasError,
  } = useAreas();

  const queryClient = useQueryClient();

  const onSubmit = (data: any) => {
    const movimiento = {
      ...data,
      tipo: "salida",
      usuario: `${user?.name} ${user?.lastname}`,
    };

    toast.promise(createMovimiento(movimiento), {
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["movimientos", "salidas"],
          exact: true,
        });
        return "Salida creada correctamente";
      },
      error: (error) => {
        return `Ocurrio un error al crear la salida ${error.message}`;
      },
      loading: "Cargando...",
    });

    reset();
    setIsSheetOpen(false);
  };

  if (productsLoading) return <div>Cargando productos...</div>;
  if (productsError) return <div>Error al cargar productos</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Salida de Productos</h2>
        <Button onClick={() => setIsSheetOpen(true)}>Crear Nueva Salida</Button>
      </div>
      {salidasLoading ? (
        <div>Cargando salidas...</div>
      ) : salidasError ? (
        <div>Error al cargar salidas</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Tienda Origen</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Fecha de Creación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salidas?.map((row: Movimiento) => (
              <TableRow key={row.id}>
                <TableCell>{row.producto}</TableCell>
                <TableCell>
                  {row.observations === ""
                    ? "Sin Observaciones"
                    : row.observations}
                </TableCell>
                <TableCell>{row.tiendaOrigen}</TableCell>
                <TableCell>{row.cantidad}</TableCell>
                <TableCell>
                  {convertTimestampToDetailedDate(row.createdAt)}
                </TableCell>
              </TableRow>
            ))}
            {salidas?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Crear Nueva Salida</SheetTitle>
            <SheetDescription>
              Complete los detalles para la nueva salida de productos.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="producto" className="text-right">
                  Producto
                </Label>
                <div className="col-span-3">
                  {productsLoading ? (
                    <div>Cargando productos...</div>
                  ) : productsError ? (
                    <div>Error al cargar productos</div>
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        setValue("producto", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((product) => (
                          <SelectItem key={product.id} value={product.name}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.producto && (
                    <p className="text-red-500">{errors.producto.message}</p>
                  )}
                </div>
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="cantidad" className="text-right">
                  Cantidad
                </Label>
                <Controller
                  name="cantidad"
                  control={control}
                  defaultValue={Number(0)}
                  render={({ field }) => (
                    <Input
                      id="cantidad"
                      type="number"
                      className="col-span-3"
                      {...field}
                    />
                  )}
                />
                {errors.cantidad && (
                  <p className="col-span-4 text-red-500">
                    {errors.cantidad.message}
                  </p>
                )}
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="tiendaOrigen" className="text-right">
                  Tienda Origen
                </Label>
                <div className="col-span-3">
                  {areasLoading ? (
                    <div>Cargando áreas...</div>
                  ) : areasError ? (
                    <div>Error al cargar áreas</div>
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        setValue("tiendaOrigen", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una tienda" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas?.map((area: Area) => (
                          <SelectItem key={area.id} value={area.nombre}>
                            {area.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.tiendaOrigen && (
                    <p className="text-red-500">
                      {errors.tiendaOrigen.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="observations" className="text-right">
                  Observaciones
                </Label>
                <Controller
                  name="observations"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Textarea
                      id="observations"
                      className="col-span-3"
                      {...field}
                    />
                  )}
                />
                {errors.observations && (
                  <p className="col-span-4 text-red-500">
                    {errors.observations.message}
                  </p>
                )}
              </div>
            </div>
            <SheetFooter>
              <Button type="submit">Crear</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
