import { View, Text } from 'react-native'
import { router } from 'expo-router';
import React from 'react'

import ScreenWrapper from '../../../components/ScreenWrapper'
import CustomButton from '../../../components/CustomButton'

const Home = () => {
  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <View className="items-center justify-center w-full h-full" >
          <Text>Dashboard</Text>
          <CustomButton
              title="Chat Bot"
              handlePress={() => router.push('/home/chatBot')}
              containerStyles="w-80 h-40 bg-quintet"
              textStyles="text-2xl"
            />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Home