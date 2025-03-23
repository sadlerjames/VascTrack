import { View } from 'react-native'
import { router } from 'expo-router';
import React from 'react'

import ScreenWrapper from '../../../components/ScreenWrapper'
import CustomButton from '../../../components/CustomButton'

const Record = () => {
  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <View className="items-center justify-center w-full h-full" >
          <View className="p-2">
            <CustomButton
              title="Track your Symptoms"
              handlePress={() => router.push('/record/symptoms')}
              containerStyles="w-80 h-40 bg-quintet"
              textStyles="text-2xl"
            />

            <CustomButton
              title="Manage your Medication"
              handlePress={() => router.push('/record/medication')}
              containerStyles="w-80 h-40 bg-quintet mt-3"
              textStyles="text-2xl"
            />  


            <CustomButton
              title="Notifications"
              handlePress={() => router.push('/record/notifications')}
              containerStyles="w-80 h-40 bg-quintet mt-3"
              textStyles="text-2xl"
            />  
          </View>

        </View>
        
      </View>
    </ScreenWrapper>
  )
}

export default Record