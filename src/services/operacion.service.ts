import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";

export interface Movimiento {
  id: string;
  tipo: "ingreso" | "salida" | "prestamo" | "retorno" | "transferencia";
  producto: string;
  descripcion: string;
  cantidad: number;
  usuario: string;
  createdAt: Timestamp;
  observations?: string;
  tiendaDestino?: string;
  tiendaOrigen?: string;
  prestamoId?: string;
  status: string;
}

const movimientosCollection = collection(db, "movimientos");

export const getMovimientos = async (): Promise<Movimiento[]> => {
  try {
    const snapshot = await getDocs(movimientosCollection);
    const movimientos = snapshot.docs.map((doc) => {
      const data = doc.data();
      const movimiento: Movimiento = {
        id: doc.id,
        tipo: data.tipo,
        descripcion: data.descripcion,
        cantidad: data.cantidad,
        usuario: data.usuario,
        createdAt: data.createdAt,
        observations: data.observations,
        tiendaDestino: data.tiendaDestino,
        tiendaOrigen: data.tiendaOrigen,
        prestamoId: data.prestamoId,
        status: data.status,
        producto: data.producto,
      };
      return movimiento;
    });

    return movimientos;
  } catch (error) {
    console.error("Error al obtener los movimientos:", error);
    throw error;
  }
};

export const getMovimientoById = async (id: string): Promise<Movimiento> => {
  try {
    const movimientoDoc = doc(db, "movimientos", id);
    const movimientoSnapshot = await getDoc(movimientoDoc);

    if (!movimientoSnapshot.exists()) {
      throw new Error("Movimiento no encontrado");
    }
    const data = movimientoSnapshot.data();
    const movimiento: Movimiento = {
      id: movimientoSnapshot.id,
      tipo: data.tipo,
      descripcion: data.descripcion,
      cantidad: data.cantidad,
      usuario: data.usuario,
      createdAt: data.createdAt,
      observations: data.observations,
      tiendaDestino: data.tiendaDestino,
      tiendaOrigen: data.tiendaOrigen,
      prestamoId: data.prestamoId,
      status: data.status,
      producto: data.producto,
    };

    return movimiento;
  } catch (error) {
    console.error(`Error al obtener el movimiento con id ${id}:`, error);
    throw error;
  }
};

export const createMovimiento = async (movimiento: {
  tipo: "ingreso" | "salida" | "prestamo" | "retorno" | "transferencia";
  producto: string;
  descripcion: string;
  cantidad: number;
  usuario: string;
  observations?: string;
  tiendaDestino?: string;
  tiendaOrigen?: string;
  prestamoId?: string;
}) => {
  try {
    // 1. Buscar el producto
    const productosCollection = collection(db, "productos");
    const productoQuery = query(
      productosCollection,
      where("name", "==", movimiento.producto)
    );
    const productoSnapshot = await getDocs(productoQuery);

    if (productoSnapshot.empty) {
      throw new Error("Producto no encontrado.");
    }

    const productoDoc = productoSnapshot.docs[0];
    const productoData = productoDoc.data();
    let nuevoStockGlobal = +productoData.stock;

    // 2. Buscar áreas según sea necesario
    const areasCollection = collection(db, "areas");

    const obtenerAreaData = async (areaNombre: string) => {
      const areaQuery = query(
        areasCollection,
        where("nombre", "==", areaNombre)
      );
      const areaSnapshot = await getDocs(areaQuery);

      if (areaSnapshot.empty) {
        throw new Error(`Área '${areaNombre}' no encontrada.`);
      }

      return areaSnapshot.docs[0];
    };

    const validarStockEnArea = async (
      areaNombre: string,
      producto: string,
      cantidad: number
    ) => {
      const areaDoc = await obtenerAreaData(areaNombre);
      const areaData = areaDoc.data();
      const productosEnArea = areaData.productos || {};

      if (!productosEnArea[producto]) {
        throw new Error(
          `El producto '${producto}' no está registrado en el área '${areaNombre}'.`
        );
      }

      if (productosEnArea[producto].stock < cantidad) {
        throw new Error(
          `Stock insuficiente en el área '${areaNombre}' para el producto '${producto}'.`
        );
      }

      return areaDoc;
    };

    const actualizarAreaStock = async (
      areaDoc: any,
      producto: string,
      cantidad: number
    ) => {
      const areaData = areaDoc.data();
      const productosEnArea = areaData.productos || {};

      productosEnArea[producto].stock += cantidad;

      if (productosEnArea[producto].stock < 0) {
        throw new Error("El stock en el área no puede ser negativo.");
      }

      await updateDoc(areaDoc.ref, { productos: productosEnArea });
    };

    // 3. Validar y ajustar stock según tipo de movimiento
    switch (movimiento.tipo) {
      case "ingreso":
        nuevoStockGlobal += movimiento.cantidad;
        if (movimiento.tiendaDestino) {
          const areaDoc = await obtenerAreaData(movimiento.tiendaDestino);
          await actualizarAreaStock(
            areaDoc,
            movimiento.producto,
            movimiento.cantidad
          );
        }
        break;

      case "salida":
        nuevoStockGlobal -= movimiento.cantidad;
        if (movimiento.tiendaOrigen) {
          const areaDoc = await validarStockEnArea(
            movimiento.tiendaOrigen,
            movimiento.producto,
            movimiento.cantidad
          );
          await actualizarAreaStock(
            areaDoc,
            movimiento.producto,
            -movimiento.cantidad
          );
        }
        break;

      case "prestamo":
        if (movimiento.tiendaOrigen) {
          const areaDoc = await validarStockEnArea(
            movimiento.tiendaOrigen,
            movimiento.producto,
            movimiento.cantidad
          );
          await actualizarAreaStock(
            areaDoc,
            movimiento.producto,
            -movimiento.cantidad
          );
        }
        break;

      case "retorno":
        nuevoStockGlobal += movimiento.cantidad;
        if (movimiento.tiendaOrigen) {
          const areaDoc = await obtenerAreaData(movimiento.tiendaOrigen);
          await actualizarAreaStock(
            areaDoc,
            movimiento.producto,
            movimiento.cantidad
          );
        }
        break;

      case "transferencia":
        if (!movimiento.tiendaOrigen || !movimiento.tiendaDestino) {
          throw new Error(
            "Para una transferencia, se requiere el área origen y destino."
          );
        }

        const areaOrigenDoc = await validarStockEnArea(
          movimiento.tiendaOrigen,
          movimiento.producto,
          movimiento.cantidad
        );
        const areaDestinoDoc = await obtenerAreaData(movimiento.tiendaDestino);

        await actualizarAreaStock(
          areaOrigenDoc,
          movimiento.producto,
          -movimiento.cantidad
        );
        await actualizarAreaStock(
          areaDestinoDoc,
          movimiento.producto,
          movimiento.cantidad
        );
        break;

      default:
        throw new Error(`Tipo de movimiento desconocido: ${movimiento.tipo}`);
    }

    // 4. Validar stock global
    if (nuevoStockGlobal < 0) {
      throw new Error("El stock global no puede ser negativo.");
    }

    // 5. Actualizar el stock global del producto
    await updateDoc(productoDoc.ref, { stock: nuevoStockGlobal });

    // 6. Si todas las validaciones pasan, crear el movimiento
    const newMovimiento = {
      ...movimiento,
      createdAt: serverTimestamp(),
      status: "activo",
    };

    const docRef = await addDoc(movimientosCollection, newMovimiento);

    return {
      id: docRef.id,
      ...newMovimiento,
      stockGlobal: nuevoStockGlobal,
    };
  } catch (error) {
    console.error("Error al crear el movimiento:", error);
    throw error; // Interrumpe la ejecución y no realiza ninguna escritura
  }
};

export const updateMovimiento = async (
  id: string,
  movimiento: {
    producto: string;
    descripcion: string;
    cantidad: number;
    usuario: string;
    observations?: string;
    tiendaDestino?: string;
    tiendaOrigen?: string;
    prestamoId?: string;
  }
) => {
  try {
    const movimientoDoc = doc(db, "movimientos", id);
    await updateDoc(movimientoDoc, {
      ...movimiento,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error al actualizar el movimiento con id ${id}:`, error);
    throw error;
  }
};

export const deleteMovimiento = async (id: string): Promise<void> => {
  try {
    const movimientoDoc = doc(db, "movimientos", id);
    await updateDoc(movimientoDoc, { status: "inactivo" }); // Actualizar el estado a inactivo
  } catch (error) {
    console.error(`Error al eliminar el movimiento con id ${id}:`, error);
    throw error;
  }
};

export const getMovimientosByTipo = async (
  tipo: "ingreso" | "salida" | "prestamo" | "retorno" | "transferencia"
): Promise<Movimiento[]> => {
  try {
    const q = query(movimientosCollection, where("tipo", "==", tipo));
    const snapshot = await getDocs(q);
    const movimientos = snapshot.docs.map((doc) => {
      const data = doc.data();
      const movimiento: Movimiento = {
        id: doc.id,
        tipo: data.tipo,
        descripcion: data.descripcion,
        cantidad: data.cantidad,
        usuario: data.usuario,
        createdAt: data.createdAt,
        observations: data.observations,
        tiendaDestino: data.tiendaDestino,
        tiendaOrigen: data.tiendaOrigen,
        prestamoId: data.prestamoId,
        status: data.status,
        producto: data.producto,
      };
      return movimiento;
    });

    console.warn(movimientos);
    return movimientos;
  } catch (error) {
    console.error(`Error al obtener los movimientos de tipo ${tipo}:`, error);
    throw error;
  }
};
