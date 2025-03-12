import { View, Text, Image, TouchableOpacity } from 'react-native'
import { router } from 'expo-router';
import React from 'react'

import ScreenWrapper from '../../../components/ScreenWrapper'
import CustomButton from '../../../components/CustomButton'
import icons from '../../../constants/icons';

const Home = () => {
  return (
    <ScreenWrapper>
    

      <View className="flex-1 items-center justify-center">

        {/* Row of Two Cards */}
        <View className="flex-row w-11/12 justify-between">
          
          {/* First Card */}
          <TouchableOpacity 
            className="flex-1 bg-primary p-4 rounded-2xl shadow-sm shadow-primary"
            onPress={() => router.push('/home/chatBot')} 
          >
            <Image 
              source={icons.robot}
              className="w-full h-32"
              resizeMode='contain'
            />
          </TouchableOpacity>

          {/* Second Card */}
          <View className="flex-1 bg-primary p-4 rounded-2xl shadow-sm shadow-primary">
            <Image 
              source={icons.graph}
              className="w-full h-32"
              resizeMode='contain'
            />
          </View>

        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Home