import React from "react";
import { View, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import WaveHeader from '../components/Header'

const ScreenWrapper = ({ children, backgroundColor = "#ADE2FF", barStyle = "dark-content" }) => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <View className="w-full h-full bg-white">
            <WaveHeader />
            {children}      
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ScreenWrapper;
