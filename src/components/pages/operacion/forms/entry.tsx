import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EntryFormProps {
  product: { name: string; quantity: number };
}

export default function EntryForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="entryQuantity">Cantidad a Ingresar</Label>
        <Input id="entryQuantity" type="number" required />
      </div>
      <div>
        <Label htmlFor="entryDate">Fecha de Ingreso</Label>
        <Input id="entryDate" type="date" required />
      </div>
      <Button type="submit">Registrar Entrada</Button>
    </form>
  );
}
