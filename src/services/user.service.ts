import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  createdAt: Timestamp;
  dni: string;
  email: string;
  lastname: string;
  name: string;
  phone: string;
  role: string;
  status: boolean | string;
  updatedAt: Timestamp;

  password?: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, "usuarios");
    const snapshot = await getDocs(usersCollection);

    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      const user: User = {
        id: doc.id,
        createdAt: data.createdAt,
        dni: data.dni,
        email: data.email,
        lastname: data.lastname,
        name: data.name,
        phone: data.phone,
        role: data.role,
        status: data.status,
        updatedAt: data.updatedAt,
      };
      return user;
    });

    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export const createUser = async (user: any) => {
  try {
    const username = user.dni;
    const password = await bcrypt.hash(user.dni, 10);

    const newUser = {
      ...user,
      username,
      password,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const usersCollection = collection(db, "usuarios");
    const docRef = await addDoc(usersCollection, newUser);
    return { id: docRef.id, ...newUser };
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
};

export const updateUser = async (id: string, user: any) => {
  try {
    const userDoc = doc(db, "usuarios", id);
    await updateDoc(userDoc, {
      ...user,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user: ", error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const userDoc = doc(db, "usuarios", id);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      throw new Error("User not found");
    }
    const data = userSnapshot.data();
    const user: User = {
      id: userSnapshot.id,
      createdAt: data.createdAt,
      dni: data.dni,
      email: data.email,
      lastname: data.lastname,
      name: data.name,
      phone: data.phone,
      role: data.role,
      status: data.status,
      updatedAt: data.updatedAt,
    };

    return user;
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const userDoc = doc(db, "usuarios", id);
    await deleteDoc(userDoc);
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw error;
  }
};
