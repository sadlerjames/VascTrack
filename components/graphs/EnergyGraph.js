import { View, Text, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit'

import CustomDropdown from '../CustomDropdown'
import { fetchUserEnergyLevels } from '../../lib/fetch'
import { useGlobalContext } from '../../context/GlobalProvider'

const EnergyGraph = () => {
  const { user } = useGlobalContext();
  const [energyLevels, setEnergyLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState("7d"); // 7 days or 1 month
  const [isFocus, setIsFocus] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const loadEnergyLevels = async () => {
      if (!user) return;
      try {
        const fetchedEnergyLevels = await fetchUserEnergyLevels();
        setEnergyLevels(fetchedEnergyLevels);
      } catch (error) {
        console.error("Error loading energy levels:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEnergyLevels();
  }, [user]);

  // Used to calculate y axis scale
  const getMinMax = (dataPoints) => {
    // Filter out null values for min/max calculation
    const validPoints = dataPoints.filter(point => point !== null);
    
    if (!validPoints || validPoints.length === 0) return { min: 0, max: 5 };
  
    const min = Math.min(...validPoints);
    const max = Math.max(...validPoints);
  
    // Optionally pad the range a little
    const padding = 0.5;
    const adjustedMin = Math.max(0, Math.floor(min - padding)); // Ensure min is not negative
    const adjustedMax = Math.min(5, Math.ceil(max + padding)); // Cap at 5 if needed
  
    return {
      min: adjustedMin,
      max: adjustedMax,
    };
  };
  
  const convertFirestoreTimestamp = (timestamp) => {
    try {
      if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) return date;
        throw new Error(`Invalid date string: ${timestamp}`);
      } else if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000);
      }
      throw new Error(`Unknown timestamp format: ${JSON.stringify(timestamp)}`);
    } catch (error) {
      console.error("Error parsing date:", error);
      return new Date();
    }
  };

  const formatDateLabel = (date) => {
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return daysOfWeek[date.getDay()];
  };
  
  // Get date string in YYYY-MM-DD format for grouping
  const getDateString = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (energyLevels.length === 0) return;
  
    try {
      // Sort energy levels by date
      const sortedEnergyLevels = energyLevels.sort((a, b) => {
        return convertFirestoreTimestamp(a.recordedAt) - convertFirestoreTimestamp(b.recordedAt);
      });
  
      const now = new Date();
      
      if (selectedRange === "7d") {
        // Get start date (6 days ago)
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        
        // Create array of all 7 days
        const allDays = [];
        for (let i = 0; i < 7; i++) {
          const day = new Date(sevenDaysAgo);
          day.setDate(sevenDaysAgo.getDate() + i);
          allDays.push({
            date: day,
            dateString: getDateString(day),
            label: formatDateLabel(day)
          });
        }
        
        // Filter entries within the 7-day range
        const filteredEntries = sortedEnergyLevels.filter((entry) => {
          const date = convertFirestoreTimestamp(entry.recordedAt);
          return date >= sevenDaysAgo && date <= now;
        });
        
        // Group by day
        const entriesByDay = {};
        filteredEntries.forEach(entry => {
          const date = convertFirestoreTimestamp(entry.recordedAt);
          const dateString = getDateString(date);
          
          if (!entriesByDay[dateString]) {
            entriesByDay[dateString] = [];
          }
          entriesByDay[dateString].push(entry);
        });
        
        // Create data points with averages or null for days with no data
        const labels = allDays.map(day => day.label);
        const dataPoints = allDays.map(day => {
          const entries = entriesByDay[day.dateString];
          if (!entries || entries.length === 0) {
            return null; // No data for this day
          }
          
          // Calculate average
          const sum = entries.reduce((total, entry) => total + entry.energyLevel, 0);
          return Math.round((sum / entries.length) * 10) / 10; // Round to 1 decimal place
        });
        
        // Calculate min/max for y-axis scale
        const { min, max } = getMinMax(dataPoints);
        
        setChartData({
          labels,
          datasets: [{ data: dataPoints }],
          min,
          max,
        });
        
      } else if (selectedRange === "30d") {
        // Logic for monthly view (4 weeks)
        const monthAgo = new Date(now);
        monthAgo.setDate(now.getDate() - 28);
        
        const filtered = sortedEnergyLevels.filter((entry) => {
          const date = convertFirestoreTimestamp(entry.recordedAt);
          return date >= monthAgo && date <= now;
        });
  
        // Group by week
        const weeks = [[], [], [], []];
        const weekStart = new Date(monthAgo);
        for (let i = 0; i < 4; i++) {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);
  
          weeks[i] = filtered.filter((entry) => {
            const date = convertFirestoreTimestamp(entry.recordedAt);
            return date >= weekStart && date < weekEnd;
          });
  
          weekStart.setDate(weekStart.getDate() + 7);
        }
  
        const labels = weeks.map((week, i) => {
          const start = new Date(monthAgo);
          start.setDate(start.getDate() + i * 7);
          return `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()}`;
        });
  
        const dataPoints = weeks.map((week) => {
          if (week.length === 0) return null; // Change to null if no data
          const total = week.reduce((sum, e) => sum + e.energyLevel, 0);
          return Math.round(total / week.length);
        });
  
        const { min, max } = getMinMax(dataPoints);
        setChartData({
          labels,
          datasets: [{ data: dataPoints }],
          min,
          max,
        });
      }
    } catch (error) {
      console.error("Error processing chart data:", error);
      setChartData(null);
    }
  }, [energyLevels, selectedRange]);
  
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
      stroke: "#f59e0b",
    },
  };

  return (
    <View 
        className="w-full"
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <Text className="font-plight text-lg pb-3 text-center">See how your energy levels have changed over the past week or month. This graph shows your daily averages.</Text>
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
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : chartData && chartData.labels.length > 0 ? (
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets,
          }}
          width={containerWidth > 0 ? containerWidth : 300}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          // yAxisInterval={1}
          chartConfig={chartConfig}
          bezier
          // fromZero
          withDots={true}
          withShadow={false}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          yAxisMin={0}
          yAxisMax={5}
          
          formatYLabel={(y) => Math.round(y)}
          style={{ marginVertical: 8, borderRadius: 10 }}
        />
      ) : (
        <Text className="mt-4 text-gray-500">No data available</Text>
      )}
    </View>
  );
};

export default EnergyGraph;