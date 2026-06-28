import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const syncUserToFirestore = async (user: any) => {
  if (!user?.uid) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const newUser = {
      uid: user.uid,
      name: user.name || "",
      email: user.email || "",
      role: "user",
      phone: "",
      governorate: "",
      createdAt: new Date(),
    };

    await setDoc(ref, newUser);
    return newUser;
  }

  return snap.data();
};