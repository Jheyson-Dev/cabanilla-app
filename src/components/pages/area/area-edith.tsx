import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAreaById, useUsers } from "@/hooks";
import { convertTimestampToDate } from "@/util/format-date";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateArea, updateUserRole, checkJefeInOtherArea } from "@/services";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AreaEdithSkeleton from "./area-edith-skeleton";

interface FormData {
  nombre: string;
  jefe: {
    id: string;
    name: string;
    lastname: string;
  };
  status: string;
}

const schema = yup.object().shape({
  nombre: yup.string().required("Nombre es requerido"),
  jefe: yup
    .object()
    .shape({
      id: yup.string().required("Jefe es requerido"),
      name: yup.string().required("Jefe es requerido"),
      lastname: yup.string().required("Jefe es requerido"),
    })
    .required("Jefe es requerido"),
  status: yup.string().required("Estado es requerido"),
});

export const AreaEdith: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: area, isLoading } = id ? useAreaById(id) : { data: null };
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation((data: FormData) => {
    if (!id) {
      throw new Error("ID is required");
    }
    return updateArea(id, data);
  });

  const onSubmit = async (data: FormData) => {
    if (!id) {
      toast.error("ID de área no encontrado");
      return;
    }
    try {
      // Verificar si el jefe ya pertenece a otra área
      const jefeExists = await checkJefeInOtherArea(data.jefe.id, id);
      if (jefeExists) {
        toast.error("El jefe ya pertenece a otra área");
        return;
      }

      mutation.mutate(data);
      await updateUserRole(data.jefe.id, "JEFE-AREA");
      queryClient.invalidateQueries({
        queryKey: ["areas"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["area", id],
        exact: true,
      });
      reset();
      navigate("/area");
      toast.success("Área actualizada correctamente");
    } catch (error) {
      toast.error("Ocurrió un error al actualizar el área");
      console.error("Error updating area: ", error);
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      {isLoading && <AreaEdithSkeleton />}
      <div className="container mx-auto p-4 max-w-96">
        <h1 className="text-2xl font-semibold mb-4 text-center">Editar Área</h1>
        {area && (
          <form
            className="grid grid-cols-3 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Label className="flex items-center gap-4">Nombre:</Label>
            <Input
              className="col-span-2"
              defaultValue={area?.nombre}
              {...register("nombre")}
            />
            {errors.nombre && (
              <span className="col-span-3 text-red-500">
                {errors.nombre.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Jefe:</Label>
            <div className="w-full col-span-2">
              {usersLoading ? (
                <div>Loading...</div>
              ) : usersError ? (
                <span>Error loading users</span>
              ) : (
                <Controller
                  name="jefe"
                  control={control}
                  defaultValue={area?.jefe}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        const selectedUser = users.find(
                          (user) => user.id === value
                        );
                        field.onChange({
                          id: selectedUser?.id || "",
                          name: selectedUser?.name || "",
                          lastname: selectedUser?.lastname || "",
                        });
                      }}
                      value={field.value.id}
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
                />
              )}
            </div>
            {errors.jefe && (
              <span className="col-span-3 text-red-500">
                {errors.jefe.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Estado:</Label>
            <div className="w-full col-span-2">
              <Controller
                name="status"
                control={control}
                defaultValue={area?.status}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="inactiva">Inactiva</SelectItem>
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
              defaultValue={convertTimestampToDate(area?.createdAt)}
              disabled
            />
            <Label className="flex items-center gap-4">
              Fecha Actualización:
            </Label>
            <Input
              className="col-span-2"
              defaultValue={convertTimestampToDate(area?.updatedAt)}
              disabled
            />
            <div className="flex justify-end col-span-3 gap-4">
              <Button
                type="button"
                variant="destructive"
                className="btn btn-secondary"
                onClick={() => {
                  reset();
                  navigate("/area");
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="btn btn-primary"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Actualizando.." : "Actualizar"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
