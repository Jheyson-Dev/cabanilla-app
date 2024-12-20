import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExitFormProps {
  product: { name: string; quantity: number };
}

export default function ExitForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="exitQuantity">Cantidad a Retirar</Label>
        <Input id="exitQuantity" type="number" required />
      </div>
      <div>
        <Label htmlFor="exitDate">Fecha de Salida</Label>
        <Input id="exitDate" type="date" required />
      </div>
      <div>
        <Label htmlFor="exitReason">Motivo de Salida</Label>
        <Input id="exitReason" type="text" required />
      </div>
      <Button type="submit">Registrar Salida</Button>
    </form>
  );
}
