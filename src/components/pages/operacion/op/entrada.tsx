import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useProducts, useIngresos, useAreas } from "@/hooks"; // Asegúrate de importar correctamente los hooks
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Definir el esquema de validación con Yup
const schema = yup.object().shape({
  producto: yup.string().required("El producto es obligatorio"),
  cantidad: yup
    .number()
    .required("La cantidad es obligatoria")
    .positive("La cantidad debe ser un número positivo")
    .integer("La cantidad debe ser un número entero"),
  tiendaDestino: yup.string().required("El área destino es obligatoria"),
  observations: yup.string(),
});

export default function EntradaOperations() {
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
    data: ingresos,
    isLoading: ingresosLoading,
    error: ingresosError,
  } = useIngresos();

  const { user } = useAuthStore();

  const {
    data: areas,
    isLoading: areasLoading,
    error: areasError,
  } = useAreas();

  const mutation = useMutation({
    mutationFn: (data: any) => createMovimiento(data),
  });
  const queryClient = useQueryClient();

  const onSubmit = (data: any) => {
    const movimiento = {
      ...data,
      tipo: "ingreso",
      usuario: `${user?.name} ${user?.lastname}`,
    }; // Asegúrate de reemplazar "usuarioEjemplo" con el usuario real

    mutation.mutate(movimiento);
    queryClient.invalidateQueries({
      queryKey: ["movimientos", "ingresos"],
      exact: true,
    });
    toast.success("Ingreso creado correctamente");

    reset();
    setIsSheetOpen(false);
  };

  if (productsLoading) return <div>Cargando productos...</div>;
  if (productsError) return <div>Error al cargar productos</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Entrada de Productos</h2>
        <Button onClick={() => setIsSheetOpen(true)}>
          Crear Nueva Entrada
        </Button>
      </div>
      {ingresosLoading ? (
        <div>Cargando ingresos...</div>
      ) : ingresosError ? (
        <div>Error al cargar ingresos</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Area destino</TableHead>
              <TableHead>Cantidad</TableHead>
              {/* <TableHead>Estado</TableHead> */}
              <TableHead>Fecha de Creación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingresos?.map((row: Movimiento) => (
              <TableRow key={row.id}>
                <TableCell>{row.producto}</TableCell>
                <TableCell>
                  {row.observations === ""
                    ? "Sin Observaciones"
                    : row.observations}
                </TableCell>
                <TableCell>{row.tiendaDestino}</TableCell>
                <TableCell>{row.cantidad}</TableCell>
                {/* <TableCell>{row.status}</TableCell> */}
                <TableCell>
                  {convertTimestampToDetailedDate(row.createdAt)}
                </TableCell>
              </TableRow>
            ))}
            {ingresos?.length === 0 && (
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
            <SheetTitle>Crear Nueva Entrada</SheetTitle>
            <SheetDescription>
              Complete los detalles para la nueva entrada de productos.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="tiendaDestino" className="text-right">
                  Área Destino
                </Label>
                <div className="col-span-3">
                  {areasLoading ? (
                    <div>Cargando áreas...</div>
                  ) : areasError ? (
                    <div>Error al cargar áreas</div>
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        setValue("tiendaDestino", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un área" />
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
                  {errors.tiendaDestino && (
                    <p className="text-red-500">
                      {errors.tiendaDestino.message}
                    </p>
                  )}
                </div>
              </div>
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
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Creando..." : "Crear"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
