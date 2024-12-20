"use client";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Package,
  Fuel,
  Settings,
  User,
  ChevronLeft,
  LogOut,
  Warehouse,
  LandPlot,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Usuario", icon: User, href: "/user" },
  { name: "Inventario", icon: Package, href: "/inventario" },
  { name: "Area", icon: LandPlot, href: "/area" },
  { name: "Almacen", icon: Warehouse, href: "/almacen" },
  { name: "Vales de Combustible", icon: Fuel, href: "/vales-combustible" },
  { name: "Configuración", icon: Settings, href: "/configuracion" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { clearUser } = useAuthStore();

  const signOut = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen bg-background text-foreground transition-all duration-300 ",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className={cn("font-bold text-xl", isCollapsed && "hidden")}>
          Cabanilla Demo
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                  isActive && "bg-accent"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      <div className=" mb-5  p-2">
        <NavLink
          to={"/login"}
          className={cn(
            "flex items-center gap-2 rounded-lg p-2 bg-foreground text-white hover:bg-foreground/90 transition-all duration-300 ease-in-out mt-auto ",
            isCollapsed ? "justify-center h-10" : "px-4"
          )}
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          <span
            className={cn(
              "transition-all duration-300 ease-in-out",
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            Cerrar Sesión
          </span>
        </NavLink>
      </div>
    </div>
  );
}
