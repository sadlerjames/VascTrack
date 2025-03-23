import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router';
import React, { useState } from 'react'

import ScreenWrapper from '../../../components/ScreenWrapper'
import CustomButton from '../../../components/CustomButton'
import ProgressBar from '../../../components/ProgressBar';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { recordEnergy } from '../../../lib/recording';
import icons from '../../../constants/icons';

const Home = () => {
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
    

      <View className="flex-1 items-center">

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

        {/* Row of Two Cards */}
        <View className="flex-row w-11/12 justify-between">
          
          {/* First Card */}
          <TouchableOpacity 
            className="w-[48%] bg-primary p-4 rounded-2xl shadow-sm shadow-primary"
            onPress={() => router.push('/home/chatBot')} 
          >
            <Text className="text-2xl font-pbold text-center">Need some advice?</Text>
            <Image 
              source={icons.robot}
              className="w-full h-32"
              resizeMode='contain'
            />
          </TouchableOpacity>

          {/* Second Card */}
          <View className="w-[48%] bg-primary p-4 rounded-2xl shadow-sm shadow-primary">
            <Text className="text-xl font-psemibold text-center">Your next medication is due in</Text>
            <View className="flex-1 justify-center items-center">
              <Text className="text-4xl font-pbold text-center">4 hours</Text>
            </View>
          </View>

        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Home