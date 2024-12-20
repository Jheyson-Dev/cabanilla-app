import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { UserListSkeleton } from "./user-list-skeleton";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { UserDelete } from "./user-delete";
import { User } from "@/services";
import { convertTimestampToMinimalDate } from "@/util/format-date";
import { Link } from "react-router-dom";

interface UserListProps {
  data: User[];
  isLoading: Boolean;
  isError: Boolean;
}

export function UserList({ data: users, isLoading, isError }: UserListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userSelected, setUserSelected] = useState<string>();

  if (isLoading) {
    return <UserListSkeleton />;
  }

  if (isError) {
    return <div>Error loading users.</div>;
  }

  const handleDelete = (id: string) => {
    setIsDeleteDialogOpen(true);
    setUserSelected(id);
    console.log("Eliminar usuario con el ID:", id);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.name} {user.lastname}
                </TableCell>
                <TableCell>{user.dni}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.status === "false" ? "Inactivo" : "Activo"}
                </TableCell>
                <TableCell>
                  {convertTimestampToMinimalDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  {convertTimestampToMinimalDate(user.updatedAt)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Link to={`/user/${user.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center ">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* {userSelected && (
        <UserEdith
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          id={userSelected}
        />
      )} */}

      {userSelected && (
        <UserDelete
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          id={userSelected}
        />
      )}

      {/* <UserEdith
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        id={userSelected || ""}
      />
      <UserDelete
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        id={userSelected || ""}
      /> */}
    </div>
  );
}
