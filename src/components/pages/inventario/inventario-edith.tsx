import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductById } from "@/hooks"; // Asegúrate de tener este hook
import { convertTimestampToDate } from "@/util/format-date";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateProduct } from "@/services"; // Asegúrate de tener esta función en tus servicios
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductEdithSkeleton from "./inventario-edith-skeleton"; // Asegúrate de tener este componente

interface FormData {
  name: string;
  description: string;
  status: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nombre es requerido"),
  description: yup.string().required("Descripción es requerida"),
  status: yup.string().required("Estado es requerido"),
});

export const ProductEdith: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: product, isLoading } = id ? useProductById(id) : { data: null };
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    if (!id) {
      toast.error("ID de producto no encontrado");
      return;
    }
    toast.promise(updateProduct(id, data), {
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["products"],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ["product", id],
          exact: true,
        });
        reset();
        navigate("/product");
        return "Producto actualizado correctamente";
      },
      error: "Ocurrió un error al actualizar el producto",
      loading: "Cargando...",
    });
  };

  const navigate = useNavigate();

  return (
    <div>
      {isLoading && <ProductEdithSkeleton />}
      <div className="container mx-auto p-4 max-w-96 ">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Editar Producto
        </h1>
        {product && (
          <form
            className="grid grid-cols-3 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Label className="flex items-center gap-4">Nombre:</Label>
            <Input
              className="col-span-2"
              defaultValue={product?.name}
              {...register("name")}
            />
            {errors.name && (
              <span className="col-span-3 text-red-500">
                {errors.name.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Descripción:</Label>
            <Input
              className="col-span-2"
              defaultValue={product?.description}
              {...register("description")}
            />
            {errors.description && (
              <span className="col-span-3 text-red-500">
                {errors.description.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Estado:</Label>
            <div className="w-full col-span-2">
              <Controller
                name="status"
                control={control}
                defaultValue={product?.status}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.status && (
              <span className="col-span-3 text-red-500">
                {errors.status.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Fecha Creación:</Label>
            <Input
              className="col-span-2"
              defaultValue={convertTimestampToDate(product?.createdAt)}
              disabled
            />
            <Label className="flex items-center gap-4">
              Fecha Actualización:
            </Label>
            <Input
              className="col-span-2"
              defaultValue={convertTimestampToDate(product?.updatedAt)}
              disabled
            />
            <div className="flex justify-end col-span-3 gap-4 ">
              <Button
                type="button"
                variant="destructive"
                className="btn btn-secondary"
                onClick={() => {
                  reset();
                  navigate("/product");
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="btn btn-primary">
                Actualizar
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};