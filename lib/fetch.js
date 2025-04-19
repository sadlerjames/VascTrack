import { db, auth } from "../config/FirebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

// Fetches the symptom logs of the user
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

// Fetch the medication logs of the user
export const fetchUserMedicationLogs = async () => {
  try {
    const user = auth.currentUser; // Get the logged-in user
    if (!user) throw new Error("User not logged in");

    const medLogsRef = collection(db, "users", user.uid, "medication");

    const querySnapshot = await getDocs(medLogsRef);


    const medicationLogs = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const occurredAt = data.occurredAt ? new Date(data.occurredAt) : null;

      medicationLogs.push({
        id: doc.id,
        ...data,
        occurredAt,
      });
    });

    return medicationLogs;

  } catch (error) {
    console.error("Error fetching medication logs:", error);
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
export const getUserMedications = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().medications || [] : [];
};

// Fetches all user details
export const fetchUserDetails = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User data not found.");
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
