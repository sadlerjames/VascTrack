import { View, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';

import { fetchUserEnergyLevels } from '../../lib/fetch';

import {populateTestData, seedManualMedEffectivenessData} from '../../lib/utility/devHelper'

import ScreenWrapper from '../../components/ScreenWrapper';
import Card from '../../components/Card';
import CustomButton from '../../components/CustomButton';
import SymptomGraph from '../../components/graphs/SymptomGraph';
import EnergyGraph from '../../components/graphs/EnergyGraph';
import EnergyHeatMap from '../../components/graphs/EnergyHeatMap';
import MedicationEffectivenessGraph from '../../components/graphs/MedicationEffectivenessGraph';

// Packages for PDF generation
import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";
import * as Print from 'expo-print';
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";


const Insights = () => {
  const [heatmapData, setHeatmapData] = useState(null);

  const symptomRef = useRef();
  const energyRef = useRef();
  const heatmapRef = useRef();
  const medicationEffectiveness = useRef();

  const generatePDF = async () => {
    try {
      const symptomUri = await captureRef(symptomRef, {
        format: "png",
        quality: 1,
      });
  
      const energyUri = await captureRef(energyRef, {
        format: "png",
        quality: 1,
      });
  
      const heatmapUri = await captureRef(heatmapRef, {
        format: "png",
        quality: 1,
      });
  
      // Combine images into HTML
      const html = `
        <h1>Weekly Health Report</h1>
        <h2>Symptom Severity</h2>
        <img src="${symptomUri}" style="width: 100%" />
        <h2>Energy Levels</h2>
        <img src="${energyUri}" style="width: 100%" />
        <h2>Energy Heat Map</h2>
        <img src="${heatmapUri}" style="width: 100%" />
      `;
  
      // Convert HTML to PDF
      const { uri } = await Print.printToFileAsync({ html });
  
      // Share the PDF
      await Sharing.shareAsync(uri);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      Alert.alert("Error", "Failed to generate PDF!");
    }
  };

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

          <Card>
            <Text className="text-2xl font-pbold text-center">Symptom Severity</Text>
            <ViewShot ref={symptomRef} options={{ format: "png", quality: 1 }}>
              <View className="pt-5">
                <SymptomGraph />
              </View>
            </ViewShot>
          </Card>

          <Card>
            <Text className="text-2xl font-pbold text-center">Energy Levels</Text>
            <ViewShot ref={energyRef} options={{ format: "png", quality: 1 }}>
              <View className="pt-5">
                <EnergyGraph />
              </View>
            </ViewShot>
          </Card>


          <Card>
            <Text className="text-2xl font-pbold text-center">Energy Heat Map</Text>
            <ViewShot ref={heatmapRef} options={{ format: "png", quality: 1 }}>
              <View className="pt-5">
                {heatmapData ? (
                  <EnergyHeatMap records={heatmapData} />
                ) : (
                  <Text>Loading...</Text>
                )}
              </View>
            </ViewShot>
          </Card>

          <Card>
          <Text className="text-2xl font-pbold text-center">Medication Effectiveness Insight</Text>
            <ViewShot ref={medicationEffectiveness} options={{ format: "png", quality: 1 }}>
              <View className="pt-5">
                <MedicationEffectivenessGraph />
              </View>
            </ViewShot>
          </Card>

          <View className="my-5">
            <CustomButton 
              title="Generate PDF Report" 
              containerStyles="bg-tertiary"
              handlePress={generatePDF} />
          </View>

          <View className="my-5">
            <CustomButton 
              title="Generate Data for Medications and Symptoms" 
              containerStyles="bg-tertiary"
              handlePress={seedManualMedEffectivenessData} />
          </View>
          
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Insights