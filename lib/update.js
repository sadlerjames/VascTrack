import { db, auth } from "../config/FirebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from 'firebase/auth';

export const updateUserProfile = async (userId, updatedData) => {
  try {
      const userDocRef = doc(db, 'users', userId);

      // Update Firestore user details
      await updateDoc(userDocRef, {
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          email: updatedData.email,
          dob: updatedData.dob, 
          sex: updatedData.sex
      });

      // If email changed, update Firebase Authentication email
      if (auth.currentUser && auth.currentUser.email !== updatedData.email) {
          await updateEmail(auth.currentUser, updatedData.email);
      }

      return true;
  } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
  }
};


  export const updateUserPassword = async (newPassword) => {
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        return true;
      } else {
        throw new Error("User not logged in.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };