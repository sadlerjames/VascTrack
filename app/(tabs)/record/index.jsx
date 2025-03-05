import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import WaveHeader from '../../../components/Header'
import CustomButton from '../../../components/CustomButton'

const Record = () => {
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
                handlePress={() => router.push('/record/symptoms')}
                containerStyles="w-80 h-40 bg-secondary"
                textStyles="text-2xl"
              />

              <CustomButton
                title="Manage your Medication"
                handlePress={() => router.push('/record/medication')}
                containerStyles="w-80 h-40 bg-secondary"
                textStyles="text-2xl"
              />  

              <CustomButton
                title="Record your Energy Levels"
                handlePress={() => router.push('/record/energy')}
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

export default Record