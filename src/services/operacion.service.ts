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

// export const createMovimiento = async (movimiento: {
//   tipo: "ingreso" | "salida" | "prestamo" | "retorno" | "transferencia";
//   producto: string;
//   descripcion: string;
//   cantidad: number;
//   usuario: string;
//   observations?: string;
//   tiendaDestino?: string;
//   tiendaOrigen?: string;
//   prestamoId?: string;
// }) => {
//   try {
//     const newMovimiento = {
//       ...movimiento,
//       createdAt: serverTimestamp(),
//       status: "activo", // Establecer el estado inicial como activo
//     };

//     const docRef = await addDoc(movimientosCollection, newMovimiento);

//     // Crear una consulta para obtener el producto
//     const productosCollection = collection(db, "productos");
//     const q = query(
//       productosCollection,
//       where("name", "==", movimiento.producto)
//     );
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       const productoDoc = querySnapshot.docs[0];
//       const productoData = productoDoc.data();
//       let nuevoStock = +productoData.stock;

//       // Actualizar el stock según el tipo de movimiento
//       if (movimiento.tipo === "ingreso") {
//         nuevoStock += +movimiento.cantidad;
//       } else if (
//         movimiento.tipo === "salida" ||
//         movimiento.tipo === "prestamo"
//       ) {
//         nuevoStock -= +movimiento.cantidad;
//       } else if (movimiento.tipo === "retorno") {
//         nuevoStock += +movimiento.cantidad;
//       }

//       // Actualizar el documento del producto con el nuevo stock
//       await updateDoc(productoDoc.ref, { stock: nuevoStock });
//     } else {
//       throw new Error("Producto no encontrado");
//     }

//     return { id: docRef.id, ...newMovimiento };
//   } catch (error) {
//     console.error("Error al crear el movimiento:", error);
//     throw error;
//   }
// }; Asegúrate de importar correctamente tu configuración de Firebase

// Función para crear un movimiento
export const createMovimiento = async (movimiento: {
  tipo: "ingreso" | "salida" | "prestamo" | "retorno" | "transferencia";
  producto: string; // Nombre del producto
  descripcion: string;
  cantidad: number;
  usuario: string;
  observations?: string;
  tiendaDestino?: string;
  tiendaOrigen?: string;
  prestamoId?: string;
}) => {
  try {
    // 1. Crear el movimiento inicial
    const newMovimiento = {
      ...movimiento,
      createdAt: serverTimestamp(),
      status: "activo", // Estado inicial del movimiento
    };

    // Guardar el movimiento en la colección "movimientos"
    const movimientosCollection = collection(db, "movimientos");
    const docRef = await addDoc(movimientosCollection, newMovimiento);

    // 2. Buscar el producto por su nombre
    const productosCollection = collection(db, "productos");
    const q = query(
      productosCollection,
      where("name", "==", movimiento.producto)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Producto no encontrado en la colección 'productos'.");
    }

    // Obtener el documento del producto encontrado
    const productoDoc = querySnapshot.docs[0];
    const productoData = productoDoc.data();
    let nuevoStock = +productoData.stock;

    // 3. Actualizar el stock según el tipo de movimiento
    switch (movimiento.tipo) {
      case "ingreso":
        nuevoStock += movimiento.cantidad;
        break;
      case "salida":
      case "prestamo":
        nuevoStock -= movimiento.cantidad;
        break;
      case "retorno":
        nuevoStock += movimiento.cantidad;
        break;
      case "transferencia":
        if (!movimiento.tiendaDestino || !movimiento.tiendaOrigen) {
          throw new Error(
            "Para movimientos de transferencia se requiere 'tiendaDestino' y 'tiendaOrigen'."
          );
        }
        nuevoStock -= movimiento.cantidad; // Reducir stock de la tienda origen
        // Aquí podrías agregar lógica adicional para actualizar la tienda destino.
        break;
      default:
        throw new Error("Tipo de movimiento no reconocido.");
    }

    // Validar que el stock no sea negativo
    if (nuevoStock < 0) {
      throw new Error("El stock no puede ser negativo.");
    }

    // Actualizar el stock del producto en Firestore
    await updateDoc(productoDoc.ref, { stock: nuevoStock });

    // 4. Devolver el resultado del movimiento
    return { id: docRef.id, ...newMovimiento, stockActualizado: nuevoStock };
  } catch (error) {
    console.error("Error al crear el movimiento:", error);
    throw error;
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
