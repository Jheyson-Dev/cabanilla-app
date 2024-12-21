import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
// import { VoucherListSkeleton } from "./voucher-list-skeleton"; // Asegúrate de tener este componente
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { VoucherDelete } from "./voucher-delete"; // Asegúrate de tener este componente
import { FuelVoucher } from "@/services/voucher.service";
import { convertTimestampToMinimalDate } from "@/util/format-date";
import { Link } from "react-router-dom";

interface VoucherListProps {
  data: FuelVoucher[];
  isLoading: Boolean;
  isError: Boolean;
}

export function VoucherList({
  data: vouchers,
  isLoading,
  isError,
}: VoucherListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [voucherSelected, setVoucherSelected] = useState<string>();

  if (isLoading) {
    // return <VoucherListSkeleton />;
  }

  if (isError) {
    return <div>Error loading vouchers.</div>;
  }

  const handleDelete = (id: string) => {
    setIsDeleteDialogOpen(true);
    setVoucherSelected(id);
    console.log("Eliminar voucher con el ID:", id);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Grifo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Meta</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Actividad</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.map((voucher: FuelVoucher) => (
              <TableRow key={voucher.id}>
                <TableCell>{voucher.number}</TableCell>
                <TableCell>{voucher.date}</TableCell>
                <TableCell>{voucher.office}</TableCell>
                <TableCell>{voucher.description}</TableCell>
                <TableCell>{voucher.requester}</TableCell>
                <TableCell>{voucher.operator}</TableCell>
                <TableCell>{voucher.meta}</TableCell>
                <TableCell>{voucher.vehicle}</TableCell>
                <TableCell>{voucher.activity}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Link to={`/vales-combustible/preview/${voucher.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    {/* <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(voucher.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {vouchers.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* 
      {voucherSelected && (
        <VoucherDelete
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          id={voucherSelected}
        />
      )} */}
    </div>
  );
}
