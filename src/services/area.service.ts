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

export interface Area {
  id: string;
  createdAt: Timestamp;
  nombre: string;
  jefe: {
    id: string;
    name: string;
    lastname: string;
  };
  updatedAt: Timestamp;
  status: string; // Añadir el campo status
}

export const getAreas = async (): Promise<Area[]> => {
  try {
    const areasCollection = collection(db, "areas");
    const snapshot = await getDocs(areasCollection);

    const areas = snapshot.docs.map((doc) => {
      const data = doc.data();
      const area: Area = {
        id: doc.id,
        createdAt: data.createdAt,
        nombre: data.nombre,
        jefe: data.jefe,
        updatedAt: data.updatedAt,
        status: data.status, // Añadir el campo status
      };
      return area;
    });

    return areas;
  } catch (error) {
    console.error("Error fetching areas: ", error);
    throw error;
  }
};

export const createArea = async (area: any) => {
  try {
    // Verificar si el jefe ya pertenece a otra área
    const jefeExists = await checkJefeInOtherArea(area.jefe.id);
    if (jefeExists) {
      throw new Error("El jefe ya pertenece a otra área");
    }

    const newArea = {
      ...area,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "activa", // Establecer el estado inicial como activa
    };

    const areasCollection = collection(db, "areas");
    const docRef = await addDoc(areasCollection, newArea);

    // Actualizar el rol del jefe a JEFE-AREA
    await updateUserRole(area.jefe.id, "JEFE-AREA");

    return { id: docRef.id, ...newArea };
  } catch (error) {
    console.error("Error creating area: ", error);
    throw error;
  }
};

export const updateArea = async (id: string, area: any) => {
  try {
    // Verificar si el jefe ya pertenece a otra área
    const jefeExists = await checkJefeInOtherArea(area.jefe.id, id);
    if (jefeExists) {
      throw new Error("El jefe ya pertenece a otra área");
    }

    const areaDoc = doc(db, "areas", id);
    await updateDoc(areaDoc, {
      ...area,
      updatedAt: serverTimestamp(),
    });

    // Actualizar el rol del jefe a JEFE-AREA
    await updateUserRole(area.jefe.id, "JEFE-AREA");
  } catch (error) {
    console.error("Error updating area: ", error);
    throw error;
  }
};

export const getAreaById = async (id: string): Promise<Area> => {
  try {
    const areaDoc = doc(db, "areas", id);
    const areaSnapshot = await getDoc(areaDoc);

    if (!areaSnapshot.exists()) {
      throw new Error("Area not found");
    }
    const data = areaSnapshot.data();
    const area: Area = {
      id: areaSnapshot.id,
      createdAt: data.createdAt,
      nombre: data.nombre,
      jefe: data.jefe,
      updatedAt: data.updatedAt,
      status: data.status, // Añadir el campo status
    };

    return area;
  } catch (error) {
    console.error("Error fetching area: ", error);
    throw error;
  }
};

export const deleteArea = async (id: string): Promise<void> => {
  try {
    const areaDoc = doc(db, "areas", id);
    await updateDoc(areaDoc, { status: "inactiva" }); // Actualizar el estado a inactiva
  } catch (error) {
    console.error("Error deleting area: ", error);
    throw error;
  }
};

// Función para actualizar el rol del usuario
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const userDoc = doc(db, "usuarios", userId);
    await updateDoc(userDoc, { role });
  } catch (error) {
    console.error(`Error updating user role for user ${userId}: `, error);
    throw error;
  }
};

// Función para verificar si el jefe ya pertenece a otra área
export const checkJefeInOtherArea = async (
  jefeId: string,
  areaId?: string
): Promise<boolean> => {
  try {
    const areasCollection = collection(db, "areas");
    const q = query(
      areasCollection,
      where("jefe.id", "==", jefeId),
      where("status", "==", "activa")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return false;
    }

    // Si se está actualizando un área, permitir que el jefe pertenezca a la misma área
    if (areaId) {
      const area = snapshot.docs.find((doc) => doc.id === areaId);
      return !area;
    }

    return true;
  } catch (error) {
    console.error("Error checking jefe in other area: ", error);
    throw error;
  }
};
