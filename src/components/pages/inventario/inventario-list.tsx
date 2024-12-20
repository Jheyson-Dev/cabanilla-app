import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Product } from "@/services";
import { convertTimestampToMinimalDate } from "@/util/format-date";
import { Link } from "react-router-dom";
import { ProductListSkeleton } from "./inventario-list-skeleton";
import { ProductDelete } from "./inventario-delete";

interface ProductListProps {
  data: Product[];
  isLoading: Boolean;
  isError: Boolean;
}

export function ProductList({
  data: products,
  isLoading,
  isError,
}: ProductListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productSelected, setProductSelected] = useState<string>();

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  if (isError) {
    return <div>Error loading products.</div>;
  }

  const handleDelete = (id: string) => {
    setIsDeleteDialogOpen(true);
    setProductSelected(id);
    console.log("Eliminar producto con el ID:", id);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  {convertTimestampToMinimalDate(product.createdAt)}
                </TableCell>
                <TableCell>
                  {convertTimestampToMinimalDate(product.updatedAt)}
                </TableCell>
                <TableCell>
                  {product.status === "inactivo" ? "Inactivo" : "Activo"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Link to={`/product/${product.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {productSelected && (
        <ProductDelete
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          id={productSelected}
        />
      )}
    </div>
  );
}
