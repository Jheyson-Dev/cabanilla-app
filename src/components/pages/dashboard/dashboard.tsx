import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { MetricsCards } from "./metrics-cards";
// import { InventoryChart } from "./inventory-chart";
// import { FuelChart } from "./fuel-chart";
// import { DataTable } from "./data-table";
// import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  return (
    <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Vouchers</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* <MetricsCards /> */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {/* <InventoryChart /> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fuel Consumption</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">{/* <FuelChart /> */}</CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>{/* <DataTable /> */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
