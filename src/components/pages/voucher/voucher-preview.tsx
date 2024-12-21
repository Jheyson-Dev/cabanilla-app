import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVoucherById } from "@/hooks/userVoucher";
import { addSignatureToVoucher } from "@/services/voucher.service"; // Asegúrate de importar correctamente el servicio
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import firma from "@/assets/firma.png";

export function VoucherPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: voucher, isLoading, isError } = useVoucherById(id!);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSign = async () => {
    // if (!user?.id) {
    //   toast.error("Usuario no autenticado");
    //   return;
    // }

    setLoading(true);
    try {
      await addSignatureToVoucher(id!, "solicitante", {
        usuario_id: user.name, // Reemplaza con el ID del usuario actual
        fecha_firma: new Date().toISOString(),
      });
      navigate("/vales-combustible");
      toast.success("Firma añadida correctamente");
    } catch (error) {
      console.error("Error adding signature: ", error);
      toast.error("Error al añadir la firma");
    } finally {
      setLoading(false);
    }
  };

  const renderSignature = (role: string) => {
    if (voucher?.firmas?.[role]?.fecha_firma) {
      return <img src={firma} alt="Firma" className="w-16 h-16 mx-auto" />;
    }
    return null;
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar el vale.</div>;
  }

  if (!voucher) {
    return <div>No se encontró el vale.</div>;
  }

  return (
    <div className="max-w-2xl p-8 mx-auto bg-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* <Image
            src="/placeholder.svg?height=50&width=50"
            alt="Logo Municipal"
            width={50}
            height={50}
          /> */}
          <div>
            <h2 className="text-lg font-bold">MUNICIPALIDAD DISTRITAL DE</h2>
            <h3 className="text-lg font-bold">CABANILLA</h3>
          </div>
        </div>
        <div className="text-right">
          <div className="p-2 border border-black">
            <p>N° {voucher.number}</p>
            <p>FECHA: {voucher.date}</p>
          </div>
        </div>
      </div>

      <h1 className="mb-6 text-xl font-bold text-center">
        VALE DE COMBUSTIBLE
      </h1>

      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-[100px_1fr] border-b">
          <span className="font-bold">Grifo:</span>
          <span>{voucher.office}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] border-b">
          <span className="font-bold">Descripción:</span>
          <span>{voucher.description}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] border-b">
          <span className="font-bold">Solicitante:</span>
          <span>{voucher.requester}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] border-b">
          <span className="font-bold">Operador:</span>
          <span>{voucher.operator}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] border-b">
          <span className="font-bold">Meta:</span>
          <span>{voucher.meta}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] border-b">
          <span className="font-bold">Vehículo:</span>
          <span>{voucher.vehicle}</span>
        </div>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="border">
            <th className="p-2 border">ITEM</th>
            <th className="p-2 border">NOMBRE</th>
            <th className="p-2 border">CANT.</th>
            <th className="p-2 border">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {voucher.items.map((item: any, index: number) => (
            <tr key={index} className="border">
              <td className="p-2 text-center border">{index + 1}</td>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 text-center border">{item.quantity}</td>
              <td className="p-2 text-center border">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-6">
        <h3 className="mb-2 font-bold">ACTIVIDAD:</h3>
        <p className="border-b">{voucher.activity}</p>
      </div>

      <div className="grid grid-cols-3 gap-8 mt-12">
        <div className="text-center">
          {renderSignature("solicitante")}
          <div className="pt-2 border-t border-black">SOLICITANTE</div>
        </div>
        <div className="text-center">
          {renderSignature("jefe_inmediato")}
          <div className="pt-2 border-t border-black">V° B° JEFE INMEDIATO</div>
        </div>
        <div className="text-center">
          {renderSignature("abastecimiento")}
          <div className="pt-2 border-t border-black">ABASTECIMIENTO</div>
        </div>
        <div className="text-center">
          {renderSignature("gerente_municipal")}
          <div className="pt-2 border-t border-black">GERENTE MUNICIPAL</div>
        </div>
        <div className="text-center">
          {renderSignature("almacen")}
          <div className="pt-2 border-t border-black">ALMACÉN</div>
        </div>
        <div className="text-center">
          {renderSignature("operador")}
          <div className="pt-2 border-t border-black">OPERADOR</div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button onClick={() => navigate(-1)} variant="outline">
          Volver
        </Button>
        <Button onClick={handleSign} disabled={loading}>
          {loading ? "Firmando..." : "Firmar"}
        </Button>
      </div>
    </div>
  );
}
