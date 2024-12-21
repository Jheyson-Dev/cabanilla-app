import AlmacenesPage from "@/components/pages/almacen/almacen";
import AreasPage from "@/components/pages/area/area";
import { AreaEdith } from "@/components/pages/area/area-edith";
import { Dashboard } from "@/components/pages/dashboard/dashboard";
import InventariosPage from "@/components/pages/inventario/inventario";
import { ProductEdith } from "@/components/pages/inventario/inventario-edith";
import Layout from "@/components/pages/Layout";
import Login from "@/components/pages/Login";
import OperacionesPage from "@/components/pages/operacion/operacion";
import UsersPage from "@/components/pages/user/user";
import { UserEdith } from "@/components/pages/user/user-edith";
import VoucherPage from "@/components/pages/voucher/voucher";
import { VoucherForm } from "@/components/pages/voucher/voucher-form";
import { VoucherPreview } from "@/components/pages/voucher/voucher-preview";
import PrivateRoute from "@/components/security/protected-routes";
// import NotFound from "@/components/pages/not-found";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "user",
        element: (
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        ),
      },
      {
        path: "user/:id",
        element: (
          <PrivateRoute>
            <UserEdith />
          </PrivateRoute>
        ),
      },
      {
        path: "product",
        element: (
          <PrivateRoute>
            <InventariosPage />
          </PrivateRoute>
        ),
      },
      {
        path: "product/:id",
        element: (
          <PrivateRoute>
            <ProductEdith />
          </PrivateRoute>
        ),
      },
      {
        path: "area",
        element: (
          <PrivateRoute>
            <AreasPage />
          </PrivateRoute>
        ),
      },
      {
        path: "area/:id",
        element: (
          <PrivateRoute>
            <AreaEdith />
          </PrivateRoute>
        ),
      },
      {
        path: "operation",
        element: (
          <PrivateRoute>
            <OperacionesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "vales-combustible",
        element: (
          <PrivateRoute>
            <VoucherPage />
          </PrivateRoute>
        ),
      },
      {
        path: "vales-combustible/create",
        element: (
          <PrivateRoute>
            <VoucherForm />
          </PrivateRoute>
        ),
      },
      {
        path: "vales-combustible/preview/:id",
        element: (
          <PrivateRoute>
            <VoucherPreview />
          </PrivateRoute>
        ),
      },
      {
        path: "almacen",
        element: (
          <PrivateRoute>
            <AlmacenesPage />
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  //   {
  //     path: "*",
  //     element: <NotFound />,
  //   },
]);
