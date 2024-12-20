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

import { Area } from "@/services";
import { convertTimestampToMinimalDate } from "@/util/format-date";
import { Link } from "react-router-dom";
import { AreaListSkeleton } from "./area-list-skeleton";
import { AreaDelete } from "./area-delete";

interface AreaListProps {
  data: Area[];
  isLoading: Boolean;
  isError: Boolean;
}

export function AreaList({ data: areas, isLoading, isError }: AreaListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [areaSelected, setAreaSelected] = useState<string>();

  if (isLoading) {
    return <AreaListSkeleton />;
  }

  if (isError) {
    return <div>Error loading areas.</div>;
  }

  const handleDelete = (id: string) => {
    setIsDeleteDialogOpen(true);
    setAreaSelected(id);
    console.log("Eliminar área con el ID:", id);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Jefe</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.map((area: Area) => (
              <TableRow key={area.id}>
                <TableCell>{area.nombre}</TableCell>
                <TableCell>{`${area.jefe.name} ${area.jefe.lastname}`}</TableCell>
                <TableCell>
                  {convertTimestampToMinimalDate(area.createdAt)}
                </TableCell>
                <TableCell>
                  {convertTimestampToMinimalDate(area.updatedAt)}
                </TableCell>
                <TableCell>{area.status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Link to={`/area/${area.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(area.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {areas.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {areaSelected && (
        <AreaDelete
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          id={areaSelected}
        />
      )}
    </div>
  );
}