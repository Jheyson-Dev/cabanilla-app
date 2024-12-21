import { Button } from "@/components/ui/button";

// import { useUsers } from "@/hooks";
import { NavLink } from "react-router-dom";
import { VoucherList } from "./voucher-list";
import { useVouchers } from "@/hooks/userVoucher";

export default function VoucherPage() {
  // const queryClient = useQueryClient();
  const { data, isLoading, isError } = useVouchers();

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold">Administracion de Vales</h1>
        <Button>
          <NavLink to={"/vales-combustible/create"}>Crear nuevo vale</NavLink>
        </Button>
      </div>
      <div className="flex gap-6">
        <div className={`flex-1 transition-all`}>
          <VoucherList
            data={data || []}
            isError={isError}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
