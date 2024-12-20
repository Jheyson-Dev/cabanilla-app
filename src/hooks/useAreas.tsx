import { getAreaById, getAreas } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useAreas = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
  });
};

export const useAreaById = (id: string) => {
  return useQuery({
    queryKey: ["area", id],
    queryFn: () => {
      return getAreaById(id);
    },
  });
};
