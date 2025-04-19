import { Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'

import icons from '../constants/icons'

const GoogleSignIn = ({ handlePress, containerStyles }) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`rounded-xl min-h-[62px] justify-center items-center bg-white ${containerStyles}`}
    >
        <View className="flex-row items-center">
            <View className="px-2">
                <Image 
                    source={icons.googleIcon}
                    className="w-7 h-7"
                    resizeMode='contain'
                />
            </View>
            <Text className={`text-black font-psemibold text-lg`}>
                Sign In with Google
            </Text>
        </View>
    </TouchableOpacity>
  )
}


export default GoogleSignIn