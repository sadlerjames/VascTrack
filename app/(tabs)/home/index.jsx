import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenWrapper from '../../../components/ScreenWrapper';
import CustomButton from '../../../components/CustomButton';
import Card from '../../../components/Card';
import ProgressBar from '../../../components/ProgressBar';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { recordEnergy } from '../../../lib/recording';
import icons from '../../../constants/icons';

const Home = () => {
  const { user } = useGlobalContext();
  const [barSelected, setBarSelected] = useState(0);
  const [nextMedicationTime, setNextMedicationTime] = useState(null);

  // Submit to DB to store
  const submit = async () => {
    try {
        if (!user) throw new Error("User not logged in");
        if (!barSelected) {
            Alert.alert("Error", "Please choose an energy level");
            return;
        }

        // Call Firestore function to save data
        await recordEnergy(user.uid, barSelected - 1);
        Alert.alert("Success", "Energy recorded successfully!"); 
    } catch (error) {
        Alert.alert("Error", error.message);
    }
  };

  // Function to calculate time remaining until next medication
  const calculateNextMedicationTime = async () => {
    try {
      // Load saved reminders from AsyncStorage
      const savedReminders = await AsyncStorage.getItem('reminders');
      const reminders = savedReminders ? JSON.parse(savedReminders) : [];
      
      // Filter out the past reminders and get the next upcoming reminder
      const upcomingReminders = reminders.filter(reminder => {
        const reminderTime = new Date(reminder.time);
        return reminderTime > new Date(); // Only future reminders
      });

      if (upcomingReminders.length > 0) {
        const nextReminder = upcomingReminders.reduce((prev, current) => {
          return new Date(prev.time) < new Date(current.time) ? prev : current;
        });

        const nextTime = new Date(nextReminder.time);
        const timeDiff = nextTime - new Date();
        
        // Calculate remaining time in hours and minutes
        const hours = Math.floor(timeDiff / (1000 * 60 * 60)); // Convert to hours
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes

        if (hours > 0) {
          setNextMedicationTime(`${hours} hours`);
        } else {
          setNextMedicationTime(`${minutes} minutes`);
        }
      }
    } catch (error) {
      console.error("Error calculating next medication time", error);
    }
  };

  useEffect(() => {
    calculateNextMedicationTime(); // Calculate the next medication time on load
  }, [user]);

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center">
        <Card>
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
        </Card>

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
              <Text className="text-4xl font-pbold text-center">{nextMedicationTime || 'N/A'}</Text>
            </View>
          </View>

        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Home