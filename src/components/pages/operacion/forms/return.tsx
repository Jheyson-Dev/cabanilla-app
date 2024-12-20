import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WithdrawalFormProps {
  product: { name: string; quantity: number };
}

export default function WithdrawalForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="withdrawalQuantity">Cantidad a Retirar</Label>
        <Input id="withdrawalQuantity" type="number" required />
      </div>
      <div>
        <Label htmlFor="withdrawalDate">Fecha de Retiro</Label>
        <Input id="withdrawalDate" type="date" required />
      </div>
      <div>
        <Label htmlFor="withdrawalReason">Motivo del Retiro</Label>
        <Input id="withdrawalReason" type="text" required />
      </div>
      <Button type="submit">Registrar Retiro</Button>
    </form>
  );
}
