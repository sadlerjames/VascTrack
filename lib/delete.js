import { auth, db } from "../config/FirebaseConfig";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";

export const deleteAccount = async () => {
  const user = auth.currentUser;

  if (!user) throw new Error("User not logged in");

  // Delete Firestore user data
  await deleteDoc(doc(db, "users", user.uid));
//   console.log("User data deleted from Firestore.");

  // Delete Firebase Auth user
  await deleteUser(user);
//   console.log("User deleted from Firebase Authentication.");
};
