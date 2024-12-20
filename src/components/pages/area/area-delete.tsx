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
import { deleteArea } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, FC, SetStateAction } from "react";
import { toast } from "sonner";

interface Props {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}

export const AreaDelete: FC<Props> = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  id,
}) => {
  const queryClient = useQueryClient();
  const Eliminar = () => {
    toast.promise(deleteArea(id), {
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["areas"],
          exact: true,
        });
        return "Área eliminada correctamente";
      },
      error: "Ocurrió un error al eliminar el área",
      loading: "Cargando...",
    });
  };

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de eliminar el área con id {id}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            área y eliminará sus datos de nuestros servidores.
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