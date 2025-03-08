import { View, Text, StatusBar, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import WaveHeader from '../../../components/Header'
import ProgressBar from '../../../components/ProgressBar'
import CustomButton from '../../../components/CustomButton'

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
              <ProgressBar selected={selected} setSelected={setSelected} />
              <View className="items-center">
                <CustomButton
                  title="Record"
                  handlePress={() => router.push('/record/energy')}
                  containerStyles="w-80 bg-secondary mt-3"
                  textStyles="text-2xl"
                />  
              </View>

            </View>
          </View>
          
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Energy