import { View, Text, FlatList, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import WaveHeader from '../../../components/Header'

const Energy = () => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#ADE2FF" barStyle="dark-content" />

        <SafeAreaView style={{flex:1}}>
          <WaveHeader />
          <View className="flex-1 items-center justify-center">

            <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
              <Text className="text-2xl font-pbold text-center">How much energy do you have?</Text>
              <Text className="text-gray-600">This is the first card.</Text>
            </View>

          

          </View>
          
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Energy