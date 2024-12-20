import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, FC, SetStateAction } from "react";
import { toast } from "sonner";

interface Props {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}

export const UserDelete: FC<Props> = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  id,
}) => {
  const queryClient = useQueryClient();
  const Eliminar = () => {
    toast.promise(deleteUser(id), {
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
          exact: true,
        });
        return "Usuario eliminado correctamente";
      },
      error: "Ocurrio un error al eliminar el usuario",
      loading: "Cargando...",
    });
  };

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de eliminar el id {id}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            usuario y eliminará sus datos de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={Eliminar}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
