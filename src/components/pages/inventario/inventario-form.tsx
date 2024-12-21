import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createProduct } from "@/services"; // Asegúrate de tener esta función en tus servicios
import Loader from "@/components/loader";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProductFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const schema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
  description: yup.string().trim().required("Description is required"),
});

export function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const onSubmitHandler: SubmitHandler<any> = async (data) => {
    // Eliminar espacios adicionales antes de enviar los datos
    data.name = data.name.trim();
    data.description = data.description.trim();

    setLoading(true);
    try {
      await createProduct({ ...data, stock: 0 });
      queryClient.invalidateQueries({
        queryKey: ["productos"],
        exact: true,
      });
      toast.success("Producto creado correctamente");
      onSubmit();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              onBlur={(e) => setValue("name", e.target.value.trim())}
            />
            {errors.name && <span>{errors.name.message}</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description")}
              onBlur={(e) => setValue("description", e.target.value.trim())}
            />
            {errors.description && <span>{errors.description.message}</span>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando producto" : "Crear Producto"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
