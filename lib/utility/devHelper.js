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

  console.log("📊 Seeding extended manual test data...");

  const userId = user.uid;
  const medicationName = "Aspirin";
  const symptomName = "Nausea";

  const now = new Date();

  // Two medication logs: one now, one 24h later
  const medTimes = [now, new Date(now.getTime() + 24 * 60 * 60 * 1000)];

  const symptomProfiles = [
    [
      { offset: 2, severity: 4.5 },
      { offset: 4, severity: 3.5 },
      { offset: 6, severity: 2.8 },
      { offset: 8, severity: 2.0 },
      { offset: 10, severity: 1.5 },
      { offset: 12, severity: 1.2 },
      { offset: 14, severity: 1.0 },
    ],
    [
      { offset: 2, severity: 4.2 },
      { offset: 4, severity: 3.3 },
      { offset: 6, severity: 2.6 },
      { offset: 8, severity: 2.1 },
      { offset: 10, severity: 1.7 },
      { offset: 12, severity: 1.4 },
      { offset: 14, severity: 1.1 },
    ],
  ];

  for (let i = 0; i < medTimes.length; i++) {
    const medTime = medTimes[i];

    // Add med log
    await addDoc(collection(db, 'users', userId, 'medication'), {
      medicationName,
      occurredAt: medTime.toISOString(),
      notes: `Test dose ${i + 1}`,
    });

    // Add related symptom logs
    for (const entry of symptomProfiles[i]) {
      const occurredAt = new Date(medTime.getTime() + entry.offset * 60 * 60 * 1000);
      await addDoc(collection(db, 'users', userId, 'symptoms'), {
        symptom: symptomName,
        severity: entry.severity,
        occurredAt: occurredAt.toISOString(),
        notes: `Symptom log ${entry.offset}h after dose ${i + 1}`,
      });
    }
  }

  console.log("✅ Seeded extended manual test data with multiple doses.");
};