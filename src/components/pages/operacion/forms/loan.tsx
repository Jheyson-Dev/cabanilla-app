import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoanFormProps {
  product: { name: string; quantity: number };
}

export default function LoanForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="loanQuantity">Cantidad a Prestar</Label>
        <Input id="loanQuantity" type="number" required />
      </div>
      <div>
        <Label htmlFor="loanDate">Fecha de Préstamo</Label>
        <Input id="loanDate" type="date" required />
      </div>
      <div>
        <Label htmlFor="borrower">Nombre del Prestatario</Label>
        <Input id="borrower" type="text" required />
      </div>
      <div>
        <Label htmlFor="returnDate">Fecha de Devolución Prevista</Label>
        <Input id="returnDate" type="date" required />
      </div>
      <Button type="submit">Registrar Préstamo</Button>
    </form>
  );
}
