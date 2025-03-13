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

// Fetches the energy levels from the db for the logged in user
export const fetchUserEnergyLevels = async () => {
  try {
    const user = auth.currentUser; // Get logged-in user
    const energyRef = collection(db, "users", user.uid, "energy");
    const querySnapshot = await getDocs(energyRef);

    const energyRecords = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return energyRecords;
  } catch (error) {
    console.error("Error fetching energy levels:", error);
    return [];
  }
};

// Fetches the users customs symptoms
export const fetchCustomSymptoms = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().customSymptoms || [] : [];
};

// Fetches the users custom medication
export const getUserMedications = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists() && userDoc.data().medications) {
      return userDoc.data().medications.map((med) => ({ label: med, value: med }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
};
