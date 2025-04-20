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
    return addDoc(collection(db, 'users', userId, 'medication'), {
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


export const seedManualMedEffectivenessData = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('User not logged in');
    return;
  }

  console.log("running data population");

  const userId = user.uid;

  const now = new Date(); // Medication dose time
  const medicationName = "Ibuprofen";
  const symptomName = "Headache";

  // Add medication log
  await addDoc(collection(db, 'users', userId, 'medication'), {
    medicationName,
    occurredAt: now.toISOString(), // ISO string format
    notes: 'Test dose for effectiveness graph',
  });

  // Symptom logs every 2 hours post-medication
  const symptomEntries = [
    { offsetHours: 2, severity: 4.0 },
    { offsetHours: 4, severity: 3.8 },
    { offsetHours: 6, severity: 3.0 },
    { offsetHours: 8, severity: 2.5 },
    { offsetHours: 10, severity: 2.0 },
    { offsetHours: 12, severity: 1.8 },
  ];

  for (const entry of symptomEntries) {
    const occurredAt = new Date(now.getTime() + entry.offsetHours * 60 * 60 * 1000);
    await addDoc(collection(db, 'users', userId, 'symptoms'), {
      symptom: symptomName,
      severity: entry.severity,
      occurredAt: occurredAt.toISOString(), // ISO format
      notes: `Test symptom log ${entry.offsetHours}h after med`,
    });
  }

  console.log("✅ Seeded manual test data with ISO strings.");
}