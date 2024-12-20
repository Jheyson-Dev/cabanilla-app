"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OperationTable } from "../operation-table";

export default function TransferenciaOperations() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const columns = [
    { header: "Fecha", accessorKey: "date" },
    { header: "Producto", accessorKey: "product" },
    { header: "Cantidad", accessorKey: "quantity" },
    { header: "Área Origen", accessorKey: "originArea" },
    { header: "Área Destino", accessorKey: "destinationArea" },
    { header: "Observaciones", accessorKey: "observations" },
  ];

  const dummyData = [
    {
      id: 1,
      date: "2023-05-10",
      product: "Producto G",
      quantity: 5,
      originArea: "Almacén A",
      destinationArea: "Almacén B",
      observations: "Transferencia rutinaria",
    },
    {
      id: 2,
      date: "2023-05-11",
      product: "Producto H",
      quantity: 3,
      originArea: "Almacén B",
      destinationArea: "Almacén C",
      observations: "Transferencia urgente",
    },
  ];

  // Aquí deberías cargar la lista real de productos desde tu backend
  const productList = [
    "Producto A",
    "Producto B",
    "Producto C",
    "Producto D",
    "Producto E",
    "Producto F",
    "Producto G",
    "Producto H",
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transferencia de Productos</h2>
        <Button onClick={() => setIsSheetOpen(true)}>
          Crear Nueva Transferencia
        </Button>
      </div>
      <OperationTable columns={columns} data={dummyData} />
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Crear Nueva Transferencia</SheetTitle>
            <SheetDescription>
              Complete los detalles para la nueva transferencia de productos.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                Producto
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {productList.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Cantidad
              </Label>
              <Input id="quantity" type="number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="originArea" className="text-right">
                Área Origen
              </Label>
              <Input id="originArea" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinationArea" className="text-right">
                Área Destino
              </Label>
              <Input id="destinationArea" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="observations" className="text-right">
                Observaciones
              </Label>
              <Textarea id="observations" className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Guardar</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
