import AlmacenesPage from "@/components/pages/almacen/almacen";
import AreasPage from "@/components/pages/area/area";
import { AreaEdith } from "@/components/pages/area/area-edith";
import { Dashboard } from "@/components/pages/dashboard/dashboard";
import InventariosPage from "@/components/pages/inventario/inventario";
import Layout from "@/components/pages/Layout";
import Login from "@/components/pages/Login";
import UsersPage from "@/components/pages/user/user";
import { UserEdith } from "@/components/pages/user/user-edith";
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
        path: "inventario",
        element: (
          <PrivateRoute>
            <InventariosPage />
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
