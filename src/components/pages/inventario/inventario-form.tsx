"use client";

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
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
});

export function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
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
    setLoading(true);
    try {
      await createProduct(data);
      queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: true,
      });
      toast.success("Producto creado correctamente");
      onSubmit();
    } catch (error) {
      console.error("Error creating product: ", error);
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
            <Input id="name" {...register("name")} />
            {errors.name && <span>{errors.name.message}</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
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