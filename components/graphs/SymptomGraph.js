import { View, Text, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit'

import CustomDropdown from '../CustomDropdown'
import { fetchUserSymptoms } from '../../lib/fetch'


const SymptomGraph = () => {
  const [symptoms, setSymptoms] = useState([]); // Store user's symptom data
  const [selectedSymptom, setSelectedSymptom] = useState(null); // Selected symptom
  const [isFocus, setIsFocus] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);

  // Fetch symptoms from users db
  useEffect(() => {
    const getSymptoms = async () => {
        try {
            const symptomRecords = await fetchUserSymptoms();
            setSymptoms(symptomRecords);
        } catch (error) {
            console.error("Error loading symptoms:", error);
        } finally {
            setLoading(false);
        }
    };
    getSymptoms();
  }, []);

  // Update chart data when symptom selection changes
  useEffect(() => {
    if (!selectedSymptom || symptoms.length === 0) return;

    // Filter symptoms by selected type
    const filteredSymptoms = symptoms
      .filter((s) => s.symptom === selectedSymptom)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort by date

    // Prepare labels (dates) and data (severity)
    const labels = filteredSymptoms.map((s) =>
      new Date(s.timestamp).toLocaleString()
    );
    const dataPoints = filteredSymptoms.map((s) => s.severity);

    setChartData({
      labels,
      datasets: [{ data: dataPoints }],
    });
  }, [selectedSymptom, symptoms]);


  const chartConfig = {
    // backgroundColor: "#1e3a8a",
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
        data={Array.from(new Set(symptoms.map((s) => ({ label: s.symptom, value: s.symptom }))))}
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