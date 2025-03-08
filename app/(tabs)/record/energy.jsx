import { View, Text, StatusBar, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import WaveHeader from '../../../components/Header'
import ProgressBar from '../../../components/ProgressBar'

const options = [1, 2, 3, 4, 5, 6];

const Energy = () => {

  const [selected, setSelected] = useState(0);
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#ADE2FF" barStyle="dark-content" />

        <SafeAreaView style={{flex:1}}>
          <WaveHeader />
          <View className="flex-1 items-center justify-center">

            <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
              <Text className="text-2xl font-pbold text-center">How much energy do you have?</Text>
              <Text className="text-gray-600">This is the first card.</Text>

              <ProgressBar selected={selected} setSelected={setSelected} />
            
            </View>

          </View>
          
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Energy