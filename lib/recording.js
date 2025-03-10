import { db } from "../config/FirebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

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
