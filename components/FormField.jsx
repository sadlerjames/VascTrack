import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'

import icons from '../constants/icons';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {

    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-black font-pmedium">{ title }</Text>

      <View className="border-2 border-gray-400 w-full h-16 px-4 bg-gray-300 rounded-2xl items-center flex-row">
        <TextInput 
            className="flex-1 text-black font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor=""
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === 'Password' && (
            <TouchableOpacity
                onPress={() =>
                    setShowPassword(!showPassword)}
            >
                    <Image 
                        source={!showPassword ? icons.eye : icons.eyeSlash}
                        className="w-6 h-6"
                        resizeMode='contain'
                    />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField