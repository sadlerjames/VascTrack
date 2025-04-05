import React from "react";
import { View, StatusBar, ScrollView  } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import WaveHeader from '../components/Header'

const ScreenWrapper = ({ children, backgroundColor = "#ADE2FF", barStyle = "dark-content", enableScroll = true }) => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <View className="w-full h-full bg-white">
            <WaveHeader />
            {enableScroll ? (
              <ScrollView style={{ flex: 1 }}>
                {children}
              </ScrollView>
            ) : (
              <View style={{ flex: 1 }}>
                {children}
              </View>
            )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ScreenWrapper;
 