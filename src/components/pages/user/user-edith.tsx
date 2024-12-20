import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserById } from "@/hooks";
import { convertTimestampToDate } from "@/util/format-date";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateUser } from "@/services";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserEdithSkeleton from "./user-edith-skeleton";

interface FormData {
  name: string;
  lastname: string;
  dni: string;
  phone: string;
  email: string;
  role: string;
  status: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nombres es requerido"),
  lastname: yup.string().required("Apellidos es requerido"),
  dni: yup.string().required("DNI es requerido"),
  phone: yup.string().required("Telefono es requerido"),
  email: yup
    .string()
    .email("Email no es válido")
    .required("Email es requerido"),
  role: yup.string().required("Role es requerido"),
  status: yup.string().required("Status es requerido"),
});

export const UserEdith: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = id ? useUserById(id) : { data: null };
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
      toast.error("ID de usuario no encontrado");
      return;
    }
    toast.promise(updateUser(id, data), {
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ["user", id],
          exact: true,
        });
        reset();
        navigate("/user");
        return "Usuario actualizado correctamente";
      },
      error: "Ocurrio un error al actualizar el usuario",
      loading: "Cargando...",
    });
  };

  const navigate = useNavigate();

  return (
    <div>
      {isLoading && <UserEdithSkeleton />}
      <div className="container mx-auto p-4 max-w-96 ">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Editar Usuario
        </h1>
        {user && (
          <form
            className="grid grid-cols-3 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Label className="flex items-center gap-4">Nombres:</Label>
            <Input
              className="col-span-2"
              defaultValue={user?.name}
              {...register("name")}
            />
            {errors.name && (
              <span className="col-span-3 text-red-500">
                {errors.name.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Apellidos:</Label>
            <Input
              className="col-span-2"
              defaultValue={user?.lastname}
              {...register("lastname")}
            />
            {errors.lastname && (
              <span className="col-span-3 text-red-500">
                {errors.lastname.message}
              </span>
            )}

            <Label className="flex items-center gap-4">DNI:</Label>
            <Input
              className="col-span-2"
              defaultValue={user?.dni}
              {...register("dni")}
            />
            {errors.dni && (
              <span className="col-span-3 text-red-500">
                {errors.dni.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Telefono:</Label>
            <Input
              className="col-span-2"
              defaultValue={user?.phone}
              {...register("phone")}
            />
            {errors.phone && (
              <span className="col-span-3 text-red-500">
                {errors.phone.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Email:</Label>
            <Input
              className="col-span-2"
              defaultValue={user?.email}
              {...register("email")}
            />
            {errors.email && (
              <span className="col-span-3 text-red-500">
                {errors.email.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Role:</Label>
            <div className="w-full col-span-2">
              <Controller
                name="role"
                control={control}
                defaultValue={user?.role}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="JEFE-AREA">Jefe de Area</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.role && (
              <span className="col-span-3 text-red-500">
                {errors.role.message}
              </span>
            )}

            <Label className="flex items-center gap-4">Status:</Label>
            <div className="w-full col-span-2">
              <Controller
                name="status"
                control={control}
                defaultValue={String(user?.status)}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
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

            <Label className="flex items-center gap-4">Fecha Creacion:</Label>
            <Input
              className="col-span-2"
              defaultValue={convertTimestampToDate(user?.createdAt)}
              disabled
            />
            <Label className="flex items-center gap-4">
              Fecha Actualizacion:
            </Label>
            <Input
              className="col-span-2"
              defaultValue={convertTimestampToDate(user?.updatedAt)}
              disabled
            />
            <div className="flex justify-end col-span-3 gap-4 ">
              <Button
                type="button"
                variant="destructive"
                className="btn btn-secondary"
                onClick={() => {
                  reset();
                  navigate("/user");
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
