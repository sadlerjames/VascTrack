import { View, Text, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit'

import CustomDropdown from '../CustomDropdown'
import { fetchCustomSymptoms, fetchUserSymptoms } from '../../lib/fetch'
import { predefinedSymptoms } from '../../constants/symptomData'
import { useGlobalContext } from '../../context/GlobalProvider'


const SymptomGraph = () => {
  const { user } = useGlobalContext();
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptoms, setCustomSymptoms] = useState([]); // Users custom symptoms
  const [selectedSymptom, setSelectedSymptom] = useState(null); // Selected symptom
  const [selectedRange, setSelectedRange] = useState("7d"); // Last 7 days or month
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

  // Format date as day of week
  const formatDateLabel = (date) => {
    try {
      const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      return daysOfWeek[date.getDay()];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "?";
    }
  };

  // Fromat data as 'MMM D'
  const formatDateAsWeekStart = (date) => {
    return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  };

  // Update chart data when symptom selection changes + data range
  useEffect(() => {
    if (!selectedSymptom || symptoms.length === 0) return;
  
    try {
      const filteredSymptoms = symptoms
        .filter((s) => s.symptom === selectedSymptom)
        .sort((a, b) => {
          const dateA = convertFirestoreTimestamp(a.occurredAt);
          const dateB = convertFirestoreTimestamp(b.occurredAt);
          return dateA - dateB;
        });
  
      const now = new Date();
      const pastDate = new Date(now);
      pastDate.setDate(pastDate.getDate() - (selectedRange === "7d" ? 7 : 30));
  
      const recentSymptoms = filteredSymptoms.filter((s) => {
        const date = convertFirestoreTimestamp(s.occurredAt);
        return date >= pastDate;
      });
  
      if (recentSymptoms.length === 0) {
        setChartData(null);
        return;
      }
  
      let labels = [];
      let dataPoints = [];
  
      if (selectedRange === "7d") {
        const last7 = recentSymptoms.slice(-7);
        labels = last7.map((s) => formatDateLabel(convertFirestoreTimestamp(s.occurredAt)));
        dataPoints = last7.map((s) => s.severity);
      } else {
        // Group into weeks
        const weekBuckets = {};
  
        recentSymptoms.forEach((s) => {
          const date = convertFirestoreTimestamp(s.occurredAt);
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday start
          const key = startOfWeek.toISOString().split('T')[0];
  
          if (!weekBuckets[key]) {
            weekBuckets[key] = [];
          }
          weekBuckets[key].push(s.severity);
        });
  
        const sortedKeys = Object.keys(weekBuckets).sort();
  
        labels = sortedKeys.map(dateStr => {
          const date = new Date(dateStr);
          return formatDateAsWeekStart(date);
        });
  
        dataPoints = sortedKeys.map(key => {
          const severities = weekBuckets[key];
          const avg = severities.reduce((a, b) => a + b, 0) / severities.length;
          return parseFloat(avg.toFixed(1));
        });
      }
  
      setChartData({
        labels,
        datasets: [{ data: dataPoints }],
      });
    } catch (error) {
      console.error("Error processing chart data:", error);
      setChartData(null);
    }
  }, [selectedSymptom, symptoms, selectedRange]);
  

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
      <Text className="font-plight text-lg pb-3 text-center">Track how your symptoms have changed over the past week or month. This graph shows average severity over time.</Text>
      <CustomDropdown
        value={selectedSymptom}
        setValue={setSelectedSymptom}
        isFocus={isFocus}
        setIsFocus={setIsFocus}
        data={Array.from(new Set(combinedSymptoms.map((s) => ({ label: s.label, value: s.value }))))}
        placeholder="Select a symptom"
        searchPlaceholder="Search..."
      />
      <View className="mt-3">
        <CustomDropdown
          value={selectedRange}
          setValue={setSelectedRange}
          isFocus={isFocus}
          setIsFocus={setIsFocus}
          data={[
            { label: "Last 7 Days", value: "7d" },
            { label: "Last Month", value: "30d" }
          ]}
          placeholder="Select time range"
          searchPlaceholder="Search..."
        />
      </View>
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
              segments={5} // 5 segments => each step is 1 unit from 0 to 5
              fromZero={true} // ensures it starts from 0
              withHorizontalLabels={true}
              yLabelsOffset={10}
              style={{ marginVertical: 8, borderRadius: 10 }}
              // 👇 Lock Y-axis max manually using this prop (see note below)
              yAxisMin={0}
              yAxisMax={5}
            />
        
        ) : (
            <Text className="mt-4 text-gray-500">No data available</Text>
        )}

    </View>
  )
}

export default SymptomGraph