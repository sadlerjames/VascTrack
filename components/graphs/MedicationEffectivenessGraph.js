import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import CustomDropdown from '../CustomDropdown';
import { useGlobalContext } from '../../context/GlobalProvider';
import { fetchUserSymptoms, fetchCustomSymptoms, getUserMedications, fetchUserMedicationLogs } from '../../lib/fetch';
import { predefinedSymptoms } from '../../constants/symptomData'
import { predefinedMedications } from '../../constants/medicationData'


const MedicationEffectivenessGraph = () => {
  const { user } = useGlobalContext();

  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [userMedication, setUserMedication] = useState([]);

  const [symptoms, setSymptoms] = useState([]);
  const [medLogs, setMedLogs] = useState([]);

  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isSymptomFocus, setIsSymptomFocus] = useState(false);
  const [isMedicationFocus, setIsMedicationFocus] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      // Get users custom symptoms and medications
      const customSymptoms = await fetchCustomSymptoms(user.uid);
      const userMeds = await getUserMedications(user.uid);
      setCustomSymptoms(customSymptoms);
      setUserMedication(userMeds)

      // Get users symptom data and medication logs
      const symptomData = await fetchUserSymptoms();
      const medData = await fetchUserMedicationLogs();
      setSymptoms(symptomData);
      setMedLogs(medData);
            
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Combine user defined symptoms with predefined symptoms
  const combinedSymptoms = [
    ...predefinedSymptoms,
    ...customSymptoms.map(symptom => ({ label: symptom, value: symptom }))
  ];

  // Combine user defined medications with predefined medications
  const combinedMedications = [
    ...predefinedMedications,
    ...userMedication.map(medication => ({ label: medication, value: medication }))
  ];

  useEffect(() => {
    if (!selectedSymptom || !selectedMedication) return;

    const timeBuckets = Array.from({ length: 13 }, (_, i) => i * 2); // 0, 2, 4, ..., 24
    const bucketedData = timeBuckets.map(() => []);

    const relevantLogs = medLogs.filter(log => log.medicationName === selectedMedication);

    relevantLogs.forEach(log => {
      const medTime = new Date(log.occurredAt.seconds * 1000);
      symptoms.forEach(symptom => {
        if (symptom.symptom !== selectedSymptom) return;

        const sympTime = new Date(symptom.occurredAt.seconds * 1000);
        const diffHours = (sympTime - medTime) / (1000 * 60 * 60);
        if (diffHours >= 0 && diffHours <= 24) {
          const bucketIndex = Math.floor(diffHours / 2);
          bucketedData[bucketIndex].push(symptom.severity);
        }
      });
    });

    const labels = timeBuckets.map(h => `${h}`);
    const dataPoints = bucketedData.map(bucket => {
      if (bucket.length === 0) return null;
      const avg = bucket.reduce((a, b) => a + b, 0) / bucket.length;
      return parseFloat(avg.toFixed(1));
    });

    setChartData({
      labels,
      datasets: [{ data: dataPoints }]
    });

  }, [selectedSymptom, selectedMedication]);

  const chartConfig = {
    backgroundGradientFrom: "#f2f2f2",
    backgroundGradientTo: "#f2f2f2",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: { r: "5", strokeWidth: "2", stroke: "#3b82f6" },
  };

  return (
    <View
      className="w-full"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {!loading && (
        <>
            <CustomDropdown
                value={selectedMedication}
                setValue={setSelectedMedication}
                isFocus={isMedicationFocus}
                setIsFocus={setIsMedicationFocus}
                data={Array.from(new Set(combinedMedications.map((m) => ({ label: m.label, value: m.value }))))}
                placeholder="Select medication"
                searchPlaceholder="Search..."
            />
            <View className="mt-3">
            <CustomDropdown
                value={selectedSymptom}
                setValue={setSelectedSymptom}
                isFocus={isSymptomFocus}
                setIsFocus={setIsSymptomFocus}
                data={Array.from(new Set(combinedSymptoms.map((s) => ({ label: s.label, value: s.value }))))}
                placeholder="Select symptom"
                searchPlaceholder="Search..."
            />
            </View>
        </>
        )}


      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : chartData ? (
        <LineChart
          data={chartData}
          width={containerWidth || Dimensions.get("window").width}
          height={220}
          chartConfig={chartConfig}
          bezier
          fromZero
          segments={5}
          yAxisMin={0}
          yAxisMax={5}
          style={{ marginVertical: 8, borderRadius: 10 }}
        />
      ) : (
        <Text className="mt-4 text-gray-500">No data available</Text>
      )}
    </View>
  );
};

export default MedicationEffectivenessGraph;
