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

export interface Product {
  id: string;
  name: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: string;
}

const productsCollection = collection(db, "productos");

export const getProducts = async (): Promise<Product[]> => {
  try {
    const snapshot = await getDocs(productsCollection);
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      const product: Product = {
        id: doc.id,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        status: data.status,
      };
      return product;
    });

    return products;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const productDoc = doc(db, "productos", id);
    const productSnapshot = await getDoc(productDoc);

    if (!productSnapshot.exists()) {
      throw new Error("Producto no encontrado");
    }
    const data = productSnapshot.data();
    const product: Product = {
      id: productSnapshot.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.status,
    };

    return product;
  } catch (error) {
    console.error(`Error al obtener el producto con id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (product: { name: string; description: string }) => {
  try {
    // Verificar si ya existe un producto con el mismo nombre
    const existingProduct = await checkProductNameExists(product.name);
    if (existingProduct) {
      throw new Error("Ya existe un producto con el mismo nombre");
    }

    const newProduct = {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "activo", // Establecer el estado inicial como activo
    };

    const docRef = await addDoc(productsCollection, newProduct);
    return { id: docRef.id, ...newProduct };
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: { name: string; description: string }) => {
  try {
    // Verificar si ya existe un producto con el mismo nombre (excluyendo el producto actual)
    const existingProduct = await checkProductNameExists(product.name, id);
    if (existingProduct) {
      throw new Error("Ya existe un producto con el mismo nombre");
    }

    const productDoc = doc(db, "productos", id);
    await updateDoc(productDoc, {
      ...product,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error al actualizar el producto con id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productDoc = doc(db, "productos", id);
    await updateDoc(productDoc, { status: "inactivo" }); // Actualizar el estado a inactivo
  } catch (error) {
    console.error(`Error al eliminar el producto con id ${id}:`, error);
    throw error;
  }
};

// Función para verificar si ya existe un producto con el mismo nombre
export const checkProductNameExists = async (name: string, excludeId?: string): Promise<boolean> => {
  try {
    const q = query(productsCollection, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false;
    }

    // Si se está actualizando un producto, permitir que el nombre pertenezca al mismo producto
    if (excludeId) {
      const product = querySnapshot.docs.find(doc => doc.id === excludeId);
      return !product;
    }

    return true;
  } catch (error) {
    console.error("Error al verificar el nombre del producto:", error);
    throw error;
  }
};