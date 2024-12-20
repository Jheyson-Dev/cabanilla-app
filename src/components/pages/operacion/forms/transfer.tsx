import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TransferFormProps {
  product: { name: string; quantity: number };
}

export default function TransferForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="transferQuantity">Cantidad a Transferir</Label>
        <Input id="transferQuantity" type="number" required />
      </div>
      <div>
        <Label htmlFor="transferDate">Fecha de Transferencia</Label>
        <Input id="transferDate" type="date" required />
      </div>
      <div>
        <Label htmlFor="destination">Destino de la Transferencia</Label>
        <Input id="destination" type="text" required />
      </div>
      <Button type="submit">Registrar Transferencia</Button>
    </form>
  );
}
