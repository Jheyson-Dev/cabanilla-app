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
import { deleteProduct } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, FC, SetStateAction } from "react";
import { toast } from "sonner";

interface Props {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}

export const ProductDelete: FC<Props> = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  id,
}) => {
  const queryClient = useQueryClient();
  const Eliminar = () => {
    toast.promise(deleteProduct(id), {
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["productos"],
          exact: true,
        });
        return "Producto eliminado correctamente";
      },
      error: "Ocurrió un error al eliminar el producto",
      loading: "Cargando...",
    });
  };

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de eliminar el producto con id {id}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            producto y eliminará sus datos de nuestros servidores.
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
