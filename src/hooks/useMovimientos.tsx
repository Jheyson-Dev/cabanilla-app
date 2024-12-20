import { getMovimientosByTipo } from "@/services/operacion.service";
import { useQuery } from "@tanstack/react-query";

export const useIngresos = () => {
  return useQuery({
    queryKey: ["movimientos", "ingresos"],
    queryFn: () => {
      return getMovimientosByTipo("ingreso");
    },
  });
};

export const useSalidas = () => {
  return useQuery({
    queryKey: ["movimientos", "salidas"],
    queryFn: () => {
      return getMovimientosByTipo("salida");
    },
  });
};
export const usePrestamos = () => {
  return useQuery({
    queryKey: ["movimientos", "prestamos"],
    queryFn: () => {
      return getMovimientosByTipo("prestamo");
    },
  });
};
export const useRetornos = () => {
  return useQuery({
    queryKey: ["movimientos", "retornos"],
    queryFn: () => {
      return getMovimientosByTipo("retorno");
    },
  });
};
