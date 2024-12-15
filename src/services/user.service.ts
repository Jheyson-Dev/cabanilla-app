import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const getUsers = async () => {
  try {
    const usersCollection = collection(db, "usuarios");
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};
