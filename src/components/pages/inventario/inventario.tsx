import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ProductForm } from "./inventario-form";

import { useProducts } from "@/hooks";
import { ProductList } from "./inventario-list";

export default function InventariosPage() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  // const queryClient = useQueryClient();
  const { data, isLoading, isError } = useProducts();

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold">Administración de Productos</h1>
        <Sheet open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
          <SheetTrigger asChild>
            <Button>Crear Producto</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Crear nuevo producto</SheetTitle>
            </SheetHeader>
            <ProductForm
              onSubmit={() => {
                setIsCreateFormOpen(false);
                // Refresh the user list
              }}
              onCancel={() => setIsCreateFormOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex gap-6">
        <div className={`flex-1 transition-all`}>
          <ProductList
            data={data || []}
            isError={isError}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
