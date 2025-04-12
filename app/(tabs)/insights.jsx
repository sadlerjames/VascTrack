import { View, Text } from 'react-native'
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react'

import { fetchUserEnergyLevels } from '../../lib/fetch';

import ScreenWrapper from '../../components/ScreenWrapper'
import CustomButton from '../../components/CustomButton'
import SymptomGraph from '../../components/graphs/SymptomGraph';
import EnergyGraph from '../../components/graphs/EnergyGraph';
import EnergyHeatMap from '../../components/graphs/EnergyHeatMap';

const Insights = () => {
  const [heatmapData, setHeatmapData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const records = await fetchUserEnergyLevels();
    
      setHeatmapData(records);
    };

    loadData();
  }, []);

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <View className="items-center justify-center w-full h-full" >

          <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
            <Text className="text-2xl font-pbold text-center">Symptom Severity</Text>
            <View className="pt-5">
              <SymptomGraph />
            </View>
          </View>

          <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
            <Text className="text-2xl font-pbold text-center">Energy Levels</Text>
            <View className="pt-5">
              <EnergyGraph />
            </View>
          </View>


          <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
            <Text className="text-2xl font-pbold text-center">Energy Heat Map</Text>
            <View className="pt-5">
              {heatmapData ? (
                <EnergyHeatMap records={heatmapData} />
              ) : (
                <Text>Loading...</Text>
              )}
            </View>
          </View>
          
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Insights