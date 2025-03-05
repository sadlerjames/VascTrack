import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import WaveHeader from '../../../components/Header'
import CustomButton from '../../../components/CustomButton'

const Symptoms = () => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#ADE2FF" barStyle="dark-content" />

      <SafeAreaView style={{flex:1}}>
        <WaveHeader />
        <View style={{ flex: 1 }}>
          <View className="items-center justify-center w-full h-full" >
            <View className="p-2">
              <CustomButton
                title="Track your Symptoms"
                // handlePress={submit}
                containerStyles="w-80 h-40 bg-secondary"
                textStyles="text-2xl"
              />


            </View>

          </View>
          
        </View>
        
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Symptoms