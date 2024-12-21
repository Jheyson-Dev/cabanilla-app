import { getVoucherById, getVouchers } from "@/services/voucher.service";
import { useQuery } from "@tanstack/react-query";

export const useVouchers = () => {
  return useQuery({
    queryKey: ["vouchers"],
    queryFn: getVouchers,
  });
};

export const useVoucherById = (id: string) => {
  return useQuery({
    queryKey: ["voucher", id],
    queryFn: () => {
      return getVoucherById(id);
    },
  });
};
