import { db } from "../config/FirebaseConfig";
import { collection, addDoc, Timestamp, arrayUnion, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

// Records the users symptom in collection under user id
export const recordSymptom = async (userId, symptom, severity, dateTime) => {
    try {
        if (!userId) throw new Error("User ID is required");

        // Reference to the user's symptoms subcollection
        const symptomsRef = collection(db, "users", userId, "symptoms");

        // Add a new symptom document
        await addDoc(symptomsRef, {
            symptom,
            severity,
            occurredAt: dateTime.toISOString(),
            recordedAt: Timestamp.now() // Firestore server timestamp
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