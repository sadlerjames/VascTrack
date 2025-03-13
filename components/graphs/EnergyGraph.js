import { View, Text, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit'

import { fetchUserEnergyLevels } from '../../lib/fetch'
import { useGlobalContext } from '../../context/GlobalProvider'

const EnergyGraph = () => {
  const { user } = useGlobalContext();
  const [energyLevels, setEnergyLevels] = useState([]);
  const [loading, setLoading] = useState(true);
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
    try {
      const sortedEnergyLevels = energyLevels.sort((a, b) => {
        return convertFirestoreTimestamp(a.recordedAt) - convertFirestoreTimestamp(b.recordedAt);
      });

      const recentEnergyLevels = sortedEnergyLevels.slice(0, 7);
      const labels = recentEnergyLevels.map((e) => formatDateLabel(convertFirestoreTimestamp(e.recordedAt)));
      const dataPoints = recentEnergyLevels.map((e) => e.energyLevel);

      setChartData({ labels, datasets: [{ data: dataPoints }] });
    } catch (error) {
      console.error("Error processing chart data:", error);
      setChartData(null);
    }
  }, [energyLevels]);

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
      <Text className="font-plight text-lg pb-3">This graph shows the trend of your energy levels over your last 7 records.</Text>
      
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
          segments={5}
          style={{ marginVertical: 8, borderRadius: 10 }}
        />
      ) : (
        <Text className="mt-4 text-gray-500">No data available</Text>
      )}
    </View>
  );
};

export default EnergyGraph;