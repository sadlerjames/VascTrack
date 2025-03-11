import { db, auth } from "../config/FirebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

// Fetches the symptoms from the db for the logged in user
export const fetchUserSymptoms = async () => {
    try {
      const user = auth.currentUser; // Get logged-in user
      if (!user) throw new Error("User not logged in");

      const symptomsRef = collection(db, "users", user.uid, "symptoms"); // path to collection
  
      const querySnapshot = await getDocs(symptomsRef);
      
      const symptoms = [];
      querySnapshot.forEach((doc) => {
        symptoms.push({ id: doc.id, ...doc.data() });
      });
  
      return symptoms;
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      return [];
    }
};

// Fetches the users customs symptoms
export const fetchCustomSymptoms = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().customSymptoms || [] : [];
};