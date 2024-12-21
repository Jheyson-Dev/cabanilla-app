"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createVoucher,
  FuelVoucher,
  VoucherItem,
} from "@/services/voucher.service"; // Asegúrate de importar correctamente los servicios
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function VoucherForm() {
  const [items, setItems] = useState<VoucherItem[]>([
    { name: "", quantity: "0", total: "0" },
  ]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // Crear el voucher con los datos del formulario
    const voucher: FuelVoucher = {
      office: formData.get("office") as string,
      description: formData.get("description") as string,
      requester: formData.get("requester") as string,
      operator: formData.get("operator") as string,
      meta: formData.get("meta") as string,
      vehicle: formData.get("vehicle") as string,
      items: items,
      activity: formData.get("activity") as string,
    };

    toast.promise(createVoucher(voucher), {
      loading: "Cargando...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["vouchers"],
          exact: true,
        });
        navigate("/vales-combustible");
        return "Vale creado correctamente";
      },
      error: () => {
        setLoading(false);
        return "Error al crear el vale";
      },
    });
  };
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="office">Grifo</Label>
            <Input id="office" name="office" required />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" name="description" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="requester">Solicitante</Label>
              <Input id="requester" name="requester" required />
            </div>
            <div>
              <Label htmlFor="operator">Operador</Label>
              <Input id="operator" name="operator" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meta">Meta</Label>
              <Input id="meta" name="meta" required />
            </div>
            <div>
              <Label htmlFor="vehicle">Vehículo</Label>
              <Input id="vehicle" name="vehicle" required />
            </div>
          </div>

          <div>
            <Label>Items</Label>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mt-2">
                <Input
                  placeholder="Nombre del producto"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].name = e.target.value;
                    setItems(newItems);
                  }}
                />
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].quantity = e.target.value;
                    newItems[index].total = e.target.value; // Assuming total is same as quantity
                    setItems(newItems);
                  }}
                />
                <Input
                  type="number"
                  placeholder="Total"
                  value={item.total}
                  readOnly
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() =>
                setItems([...items, { name: "", quantity: "0", total: "0" }])
              }
            >
              Agregar Item
            </Button>
          </div>

          <div>
            <Label htmlFor="activity">Actividad</Label>
            <Textarea id="activity" name="activity" required />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando..." : "Crear Vale"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
