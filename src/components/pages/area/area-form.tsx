import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import Loader from "@/components/loader";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createArea } from "@/services"; // Asegúrate de tener esta función en tus servicios
import { useUsers } from "@/hooks/useUsers"; // Importa el hook useUsers

interface AreaFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const schema = yup.object().shape({
  nombre: yup.string().required("Nombre is required"),
  jefe: yup
    .object()
    .shape({
      id: yup.string().required("Jefe is required"),
      name: yup.string().required("Jefe is required"),
      lastname: yup.string().required("Jefe is required"),
    })
    .required("Jefe is required"),
});

export function AreaForm({ onSubmit, onCancel }: AreaFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      jefe: {
        id: "",
        name: "",
        lastname: "",
      },
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();

  const onSubmitHandler: SubmitHandler<any> = async (data) => {
    setLoading(true);
    try {
      await createArea(data);
      queryClient.invalidateQueries({
        queryKey: ["areas"],
        exact: true,
      });
      toast.success("Área creada correctamente");
      onSubmit();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error creating area";
      toast.error(errorMessage);
      console.error("Error creating area: ", error);
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
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" {...register("nombre")} />
            {errors.nombre && <span>{errors.nombre.message}</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="jefe">Jefe</Label>
            {usersLoading ? (
              <Loader />
            ) : usersError ? (
              <span>Error loading users</span>
            ) : (
              <Select
                onValueChange={(value) => {
                  const selectedUser = users.find((user) => user.id === value);
                  setValue("jefe", {
                    id: selectedUser?.id || "",
                    name: selectedUser?.name || "",
                    lastname: selectedUser?.lastname || "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un jefe" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} {user.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.jefe && <span>{errors.jefe.message}</span>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando área" : "Crear Área"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
