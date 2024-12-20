import { useState } from "react";

// import { ProductForm } from "./inventario-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EntradaOperations from "./op/entrada";
import SalidaOperations from "./op/salida";
import PrestamoOperations from "./op/prestamo";
import RetornoOperations from "./op/retorno";
import TransferenciaOperations from "./op/transferencia";
// import { ProductList } from "./inventario-list";

export default function OperacionesPage() {
  // const queryClient = useQueryClient();
  //   const { data, isLoading, isError } = useProducts();

  const [activeTab, setActiveTab] = useState("entrada");
  const operations = [
    { id: "entrada", label: "Entrada", component: EntradaOperations },
    { id: "salida", label: "Salida", component: SalidaOperations },
    { id: "prestamo", label: "Préstamo", component: PrestamoOperations },
    { id: "retorno", label: "Retorno", component: RetornoOperations },
    {
      id: "transferencia",
      label: "Transferencia",
      component: TransferenciaOperations,
    },
  ];
  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold">Administracion de operaciones</h1>
      </div>
      <div className="flex gap-6">
        <div className={`flex-1 transition-all`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {operations.map((op) => (
                <TabsTrigger key={op.id} value={op.id}>
                  {op.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {operations.map((op) => (
              <TabsContent key={op.id} value={op.id}>
                <op.component />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
