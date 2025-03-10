import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../../components/ScreenWrapper'

import { recordEnergy } from '../../../lib/recording';
import { useGlobalContext } from '../../../context/GlobalProvider';

import ProgressBar from '../../../components/ProgressBar'
import CustomButton from '../../../components/CustomButton'


const Energy = () => {
  // Get user
  const { user } = useGlobalContext();

  const [barSelected, setBarSelected] = useState(0);

  // Submit to DB to store
  const submit = async () => {
    try {
        if (!user) throw new Error("User not logged in");
        if (!barSelected) {
            Alert.alert("Error", "Please choose an energy level");
            return;
        }

        // Call Firestore function to save data
        await recordEnergy(user.uid, barSelected-1);

        Alert.alert("Success", "Energy recorded successfully!"); 
    } catch (error) {
        Alert.alert("Error", error.message);
    }
  };
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">

        <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
          <Text className="text-2xl font-pbold text-center">How much energy do you have?</Text>
          <ProgressBar selected={barSelected} setSelected={setBarSelected} containerStyle="pt-5 pb-3" />
          
          <View className="items-center">
            <CustomButton
              title="Record"
              handlePress={submit}
              containerStyles="w-80 bg-tertiary mt-3"
              textStyles="text-2xl"
            />  
          </View>

        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Energy