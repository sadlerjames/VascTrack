import { View, Text } from 'react-native'
import React from 'react'

import ScreenWrapper from '../../components/ScreenWrapper'

const Home = () => {
  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <View className="items-center justify-center w-full h-full" >
          <Text>Dashboard</Text>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Home