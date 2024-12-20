import { collection, getDocs, query, where } from "firebase/firestore";
import { User } from "./user.service";
import { db } from "@/firebase/config";
import bcrypt from "bcryptjs";

export const login = async (
  username: string,
  password: string
): Promise<User> => {
  const q = query(
    collection(db, "usuarios"),
    where("username", "==", username)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Invalid credentials");
  }

  const userDoc = querySnapshot.docs[0];
  const user = userDoc.data() as User;

  if (!user.password) {
    throw new Error("Invalid credentials");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return user;
};
