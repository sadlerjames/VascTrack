import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'

import LineChart from './LineChart'; 
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
      // Return fallback date instead of an invalid date
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

  // Format date as MMM D
  const formatDateAsWeekStart = (date) => {
    return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  };

  // Get date string in YYYY-MM-DD format for grouping
  const getDateString = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
      pastDate.setDate(pastDate.getDate() - (selectedRange === "7d" ? 6 : 29)); // 7 days = today + 6 previous days
  
      const recentSymptoms = filteredSymptoms.filter((s) => {
        const date = convertFirestoreTimestamp(s.occurredAt);
        return date >= pastDate && date <= now;
      });
  
      if (recentSymptoms.length === 0) {
        setChartData(null);
        return;
      }
  
      let labels = [];
      let dataPoints = [];
  
      if (selectedRange === "7d") {
        // Create array of all 7 days
        const allDays = [];
        for (let i = 0; i < 7; i++) {
          const day = new Date(pastDate);
          day.setDate(pastDate.getDate() + i);
          allDays.push({
            date: day,
            dateString: getDateString(day),
            label: formatDateLabel(day)
          });
        }

        // Group symptoms by day
        const symptomsByDay = {};
        recentSymptoms.forEach(symptom => {
          const date = convertFirestoreTimestamp(symptom.occurredAt);
          const dateString = getDateString(date);
          
          if (!symptomsByDay[dateString]) {
            symptomsByDay[dateString] = [];
          }
          symptomsByDay[dateString].push(symptom);
        });

        // Create data points with averages or null for days with no data
        labels = allDays.map(day => day.label);
        dataPoints = allDays.map(day => {
          const entries = symptomsByDay[day.dateString];
          if (!entries || entries.length === 0) {
            return null; // No data for this day
          }
          
          // Calculate average
          const sum = entries.reduce((total, entry) => total + entry.severity, 0);
          return Math.round((sum / entries.length) * 10) / 10; // Round to 1 decimal place
        });
      } else {
        // Group into weeks for month view
        const startOfMonth = new Date(pastDate);
        const endOfMonth = new Date(now);
        const weekBuckets = {};
        
        // Create array of week start dates
        let currentWeekStart = new Date(startOfMonth);
        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Set to Sunday
        
        while (currentWeekStart <= endOfMonth) {
          const weekKey = getDateString(currentWeekStart);
          weekBuckets[weekKey] = {
            date: new Date(currentWeekStart),
            symptoms: []
          };
          
          // Move to next week
          const nextWeek = new Date(currentWeekStart);
          nextWeek.setDate(nextWeek.getDate() + 7);
          currentWeekStart = nextWeek;
        }
        
        // Add symptoms to appropriate week bucket
        recentSymptoms.forEach(symptom => {
          const symptomDate = convertFirestoreTimestamp(symptom.occurredAt);
          const weekStartDate = new Date(symptomDate);
          weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay()); // Set to Sunday
          
          const weekKey = getDateString(weekStartDate);
          if (weekBuckets[weekKey]) {
            weekBuckets[weekKey].symptoms.push(symptom);
          }
        });
        
        // Convert to arrays for chart
        const sortedWeeks = Object.keys(weekBuckets).sort();
        
        labels = sortedWeeks.map(key => {
          return formatDateAsWeekStart(weekBuckets[key].date);
        });
        
        dataPoints = sortedWeeks.map(key => {
          const severities = weekBuckets[key].symptoms.map(s => s.severity);
          if (severities.length === 0) return null;
          
          const avg = severities.reduce((a, b) => a + b, 0) / severities.length;
          return parseFloat(avg.toFixed(1));
        });
      }
  
      setChartData({
        labels,
        data: dataPoints,
      });
    } catch (error) {
      console.error("Error processing chart data:", error);
      setChartData(null);
    }
  }, [selectedSymptom, symptoms, selectedRange]);

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
          <View className="pt-3">
            <LineChart
              labels={chartData.labels}
              data={chartData.data}
              width={containerWidth > 0 ? containerWidth : 300}
              height={220}
              xAxisLabel={selectedRange === "7d" ? "Days" : "Weeks"}
              yAxisLabel="Severity" 
            />
          </View>
      ) : (
          <Text className="mt-4 text-gray-500">No data available</Text>
      )}
    </View>
  )
}

export default SymptomGraph