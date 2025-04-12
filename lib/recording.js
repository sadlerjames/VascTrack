import { db, auth } from "../config/FirebaseConfig";
import { collection, addDoc, Timestamp, arrayUnion, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

// Records the users symptom in collection under user id
// Records the users symptom in collection under user id
export const recordSymptom = async (userId, symptom, severity, dateTime, note = '') => {
  try {
      if (!userId) throw new Error("User ID is required");

      const symptomsRef = collection(db, "users", userId, "symptoms");

      await addDoc(symptomsRef, {
          symptom,
          severity,
          occurredAt: dateTime.toISOString(),
          recordedAt: Timestamp.now(),
          note
      });
  } catch (error) {
      throw new Error(error.message);
  }
};


// Records the medication that user taken in collection under user id
export const recordMedication = async (userId, medication, dosage, dateTime = null) => {
    try {
      if (!userId) throw new Error("User ID is required");

      // Reference to the user's symptoms subcollection
      const medicationRef = collection(db, "users", userId, "medication");
      
      // Add a new symptom document
      await addDoc(medicationRef, {
        medication,
        dosage,
        occurredAt: dateTime ? dateTime.toISOString() : null,
        recordedAt: Timestamp.now() // Firestore server timestamp
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };

// Records the medication that user taken in collection under user id
export const recordEnergy = async (userId, energyLevel) => {
    try {
        if (!userId) throw new Error("User ID is required");

        // Reference to the user's symptoms subcollection
        const medicationRef = collection(db, "users", userId, "energy");

        // Add a new symptom document
        await addDoc(medicationRef, {
            energyLevel,
            recordedAt: Timestamp.now() // Firestore server timestamp
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

// Saves a custom symptom to the users collection
export const saveCustomSymptom = async (uid, symptom) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      customSymptoms: arrayUnion(symptom)
    });
};

// Save a custom medication to the users collection
export const saveUserMedication = async (userId, medicationName) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const currentMedications = userDoc.data().medications || [];
        if (!currentMedications.includes(medicationName)) {
          await setDoc(userRef, { medications: [...currentMedications, medicationName] }, { merge: true });
        }
      } else {
        await setDoc(userRef, { medications: [medicationName] });
      }
    } catch (error) {
      console.error("Error saving medication:", error);
    }
};

// Populate the database with energy data
export const populateMockEnergyData = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User not logged in");
    return;
  }

  const energyRef = collection(db, "users", user.uid, "energy");

  const DAYS = 7; // Mon - Sun
  const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6am - 11pm

  const now = new Date();

  for (let d = 0; d < DAYS; d++) {
    for (let h = 0; h < HOURS.length; h++) {
      console.log("inside")
      // Randomly generate energy level between 0 and 5
      const energyLevel = Math.floor(Math.random() * 6); 

      // Create a timestamp for this day and hour
      const mockDate = new Date(now);
      mockDate.setDate(now.getDate() - now.getDay() + 1 + d); // Monday = 1
      mockDate.setHours(HOURS[h]);
      mockDate.setMinutes(0);
      mockDate.setSeconds(0);
      mockDate.setMilliseconds(0);

      await addDoc(energyRef, {
        energyLevel,
        recordedAt: Timestamp.fromDate(mockDate),
      });
    }
  }

  console.log("Mock energy data uploaded.");
};