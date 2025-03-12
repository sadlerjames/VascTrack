import { View, Text, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit'

import CustomDropdown from '../CustomDropdown'
import { fetchCustomSymptoms, fetchUserSymptoms } from '../../lib/fetch'
import { predefinedSymptoms } from '../../lib/data/symptomData'
import { useGlobalContext } from '../../context/GlobalProvider'


const SymptomGraph = () => {
  const { user } = useGlobalContext();
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptoms, setCustomSymptoms] = useState([]); // Users custom symptoms
  const [selectedSymptom, setSelectedSymptom] = useState(null); // Selected symptom
  const [isFocus, setIsFocus] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);

  // Get users custom symptoms
  useEffect(() => {
    const loadCustomSymptoms = async () => {
      if (!user) return;
      try {
        const fetchedSymptoms = await fetchCustomSymptoms(user.uid);
        const symptomRecords = await fetchUserSymptoms();
        setCustomSymptoms(fetchedSymptoms);
        setSymptoms(symptomRecords);
      } catch (error) {
        console.error("Error loading custom symptoms:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCustomSymptoms();
  }, [user]);

  const combinedSymptoms = [
    ...predefinedSymptoms,
    ...customSymptoms.map(symptom => ({ label: symptom, value: symptom }))
  ];

  // Convert Firestore timestamp to JavaScript Date
  const convertFirestoreTimestamp = (timestamp) => {
    try {
      if (typeof timestamp === 'string') {
        // Handle ISO string format (2025-03-07T19:56:00.000Z)
        const date = new Date(timestamp);
        
        // Check if the date is valid
        if (!isNaN(date.getTime())) {
          return date;
        }
        throw new Error(`Invalid date string: ${timestamp}`);
      } else if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
        // Handle Firestore timestamp format
        return new Date(timestamp.seconds * 1000);
      }
      throw new Error(`Unknown timestamp format: ${JSON.stringify(timestamp)}`);
    } catch (error) {
      console.error("Error parsing date:", error);
      // Return a fallback date instead of an invalid date
      return new Date(); // Current date as fallback
    }
  };

  // Format date as DD/MM
  const formatDateLabel = (date) => {
    try {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid";
    }
  };

  // Update chart data when symptom selection changes
  useEffect(() => {
    if (!selectedSymptom || symptoms.length === 0) return;
    
    try {
      const filteredSymptoms = symptoms
        .filter((s) => s.symptom === selectedSymptom)
        .sort((a, b) => {
          const dateA = convertFirestoreTimestamp(a.timestamp);
          const dateB = convertFirestoreTimestamp(b.timestamp);
          return dateA - dateB;
        });

      // Only proceed if we have data
      if (filteredSymptoms.length === 0) {
        setChartData(null);
        return;
      }

      const labels = filteredSymptoms.map((s) => {
        const date = convertFirestoreTimestamp(s.timestamp);
        return formatDateLabel(date);
      });

      const dataPoints = filteredSymptoms.map((s) => s.severity);
      
      setChartData({
        labels,
        datasets: [{ data: dataPoints }],
      });
    } catch (error) {
      console.error("Error processing chart data:", error);
      setChartData(null);
    }
  }, [selectedSymptom, symptoms]);

  const chartConfig = {
    backgroundGradientFrom: "#f2f2f2",
    backgroundGradientTo: "#f2f2f2",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#3b82f6",
    },
  }




  return (
    <View 
        className="w-full"
        onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width);
        }}
    >
      <CustomDropdown
        value={selectedSymptom}
        setValue={setSelectedSymptom}
        isFocus={isFocus}
        setIsFocus={setIsFocus}
        data={Array.from(new Set(combinedSymptoms.map((s) => ({ label: s.label, value: s.value }))))}
        placeholder="Select a symptom"
        searchPlaceholder="Search..."
      />

        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : chartData && chartData.labels.length > 0 ? (
            <LineChart
            data={chartData}
            width={containerWidth > 0 ? containerWidth : 300}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, borderRadius: 10 }}
            />
        ) : (
            <Text className="mt-4 text-gray-500">No data available</Text>
        )}

    </View>
  )
}

export default SymptomGraph