import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const productsCollection = collection(db, "productos");

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(productsCollection);
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const productDoc = doc(db, "productos", id);
    const product = await getDoc(productDoc);
    if (product.exists()) {
      return { id: product.id, ...product.data() };
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (product: {
  name: string;
  description: string;
}) => {
  try {
    const docRef = await addDoc(productsCollection, product);
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  product: { name: string; description: string }
) => {
  try {
    const productDoc = doc(db, "productos", id);
    await updateDoc(productDoc, product);
    return { id, ...product };
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const productDoc = doc(db, "productos", id);
    await deleteDoc(productDoc);
    return { id };
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};
