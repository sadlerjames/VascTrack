import { db, auth } from "../../config/FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";

/**
 * Populates test data under the current user for symptoms and medication logs.
 */
export const populateTestData = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('User not logged in');
    return;
  }

  const userId = user.uid;

  const now = new Date();

  // Simulate 5 medication logs over past 5 days
  const medLogPromises = Array.from({ length: 5 }, (_, i) => {
    const medTime = new Date(now);
    medTime.setDate(now.getDate() - i);
    medTime.setHours(8 + i); // Vary time slightly
    return addDoc(collection(db, 'users', userId, 'medicationLogs'), {
      medicationName: 'Ibuprofen',
      dosage: '200mg',
      occurredAt: medTime.toISOString(), // store as string
    });
  });

  // Simulate 10 symptom logs (some within 24h of meds)
  const symptomPromises = Array.from({ length: 10 }, (_, i) => {
    const sympTime = new Date(now);
    sympTime.setDate(now.getDate() - Math.floor(i / 2));
    sympTime.setHours(9 + (i % 4)); // vary time slightly
    return addDoc(collection(db, 'users', userId, 'symptoms'), {
      symptom: 'Headache',
      severity: Math.floor(Math.random() * 6), // 0–5
      occurredAt: sympTime.toISOString(), // store as string
      notes: 'Auto-generated test entry',
    });
  });

  try {
    await Promise.all([...medLogPromises, ...symptomPromises]);
    console.log('Test data added successfully!');
  } catch (error) {
    console.error('Error adding test data:', error);
  }
};
