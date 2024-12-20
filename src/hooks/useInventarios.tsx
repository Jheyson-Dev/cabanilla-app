import { getProductById, getProducts } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  return useQuery({
    queryKey: ["productos"],
    queryFn: getProducts,
  });
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ["area", id],
    queryFn: () => {
      return getProductById(id);
    },
  });
};
