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

  // Used to calcualte y axis scale
  const getMinMax = (dataPoints) => {
    if (!dataPoints || dataPoints.length === 0) return { min: 0, max: 5 };
  
    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
  
    // Optionally pad the range a little
    const padding = 0.5;
    const adjustedMin = Math.floor(min - padding);
    const adjustedMax = Math.ceil(max + padding);
  
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

  useEffect(() => {
    if (energyLevels.length === 0) return;
  
    const getMinMax = (dataPoints) => {
      if (!dataPoints || dataPoints.length === 0) return { min: 0, max: 5 };
      const min = Math.min(...dataPoints);
      const max = Math.max(...dataPoints);
      const padding = 0.5;
      return {
        min: Math.floor(min - padding),
        max: Math.ceil(max + padding),
      };
    };
  
    try {
      const sortedEnergyLevels = energyLevels.sort((a, b) => {
        return convertFirestoreTimestamp(a.recordedAt) - convertFirestoreTimestamp(b.recordedAt);
      });
  
      const now = new Date();
      let filtered = [];
  
      if (selectedRange === "7d") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        filtered = sortedEnergyLevels.filter((entry) => {
          const date = convertFirestoreTimestamp(entry.recordedAt);
          return date >= sevenDaysAgo && date <= now;
        });
  
        const labels = filtered.map((e) =>
          formatDateLabel(convertFirestoreTimestamp(e.recordedAt))
        );
        const dataPoints = filtered.map((e) => e.energyLevel);
  
        const { min, max } = getMinMax(dataPoints);
        setChartData({
          labels,
          datasets: [{ data: dataPoints }],
          min,
          max,
        });
  
      } else if (selectedRange === "30d") {
        const monthAgo = new Date(now);
        monthAgo.setDate(now.getDate() - 28);
        filtered = sortedEnergyLevels.filter((entry) => {
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
          if (week.length === 0) return 0;
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
          yAxisInterval={1}
          chartConfig={chartConfig}
          bezier
          fromZero={false}
          segments={chartData.max - chartData.min || 2} // safe fallback
          formatYLabel={(y) => Number(y).toFixed(0)}
          style={{ marginVertical: 8, borderRadius: 10 }}
        />
      ) : (
        <Text className="mt-4 text-gray-500">No data available</Text>
      )}
    </View>
  );
};

export default EnergyGraph;