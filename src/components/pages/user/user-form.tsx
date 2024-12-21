import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { createUser } from "@/services";
import Loader from "@/components/loader";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UserFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}
type Role = "USER" | "ADMIN";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  lastname: yup.string().required("Last Name is required"),
  dni: yup.string().required("DNI is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  role: yup
    .mixed<Role>()
    .oneOf(["USER", "ADMIN"], "Role must be either USER or ADMIN")
    .required("Role is required"),
  status: yup.boolean(),
});

export function UserForm({ onSubmit, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      lastname: "",
      dni: "",
      email: "",
      phone: "",
      role: "USER",
      status: true,
    },
  });

  // Estado para la carga de archivos
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const onSubmitHandler: SubmitHandler<any> = async (data) => {
    setLoading(true);
    try {
      await createUser(data);
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: true,
      });
      toast.success("Usuario creado correctamente");
      onSubmit();
    } catch (error) {
      console.error("Error creating user: ", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = watch("role");

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
            <Label htmlFor="lastname">Last Name</Label>
            <Input id="lastname" {...register("lastname")} />
            {errors.lastname && <span>{errors.lastname.message}</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input id="dni" {...register("dni")} />
            {errors.dni && <span>{errors.dni.message}</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && <span>{errors.phone.message}</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setValue("role", value as Role)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <span>{errors.role.message}</span>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando usuario" : "Crear Usuario"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
