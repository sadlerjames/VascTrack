import { View } from 'react-native'
import { router } from 'expo-router';
import React from 'react'

import ScreenWrapper from '../../components/ScreenWrapper'
import CustomButton from '../../components/CustomButton'
import SymptomGraph from '../../components/graphs/SymptomGraph';

const Insights = () => {
  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <View className="items-center justify-center w-full h-full" >

          <SymptomGraph />
          
        </View>
        
      </View>
    </ScreenWrapper>
  )
}

export default Insights