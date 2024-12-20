import { getUserById, getUsers } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => {
      return getUserById(id);
    },
  });
};
