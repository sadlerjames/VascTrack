import { View, Text, Alert } from 'react-native'
import { Link, router } from 'expo-router';
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';

import ScreenWrapper from '../../../components/ScreenWrapper'
import ProgressBar from '../../../components/ProgressBar'
import CustomButton from '../../../components/CustomButton'
import CustomDropdown from '../../../components/CustomDropdown'

import { recordSymptom } from '../../../lib/recording';
import { useGlobalContext } from '../../../context/GlobalProvider';

const Symptoms = () => {    
  // Get user
  const { user } = useGlobalContext();
  // Dropdown
  const [dropdownValue, setDropdownValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const data = [
    { label: "Paracetamol", value: "1" },
    { label: "Ibuprofen", value: "2" },
    { label: "Aspirin", value: "3" },
    { label: "Amoxicillin", value: "4" },
    { label: "Metformin", value: "5" },
    { label: "Atorvastatin", value: "6" },
    { label: "Omeprazole", value: "7" },
    { label: "Loratadine", value: "8" },
  ];

  //Progress Bar
  const [barSelected, setBarSelected] = useState(0);

  // Date + Time Picker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Stores only date
  const [selectedTime, setSelectedTime] = useState(new Date()); // Stores only time

  const onDateChange = (event, newDate) => {
    if (newDate) setSelectedDate(newDate);
  };

  const onTimeChange = (event, newTime) => {
    if (newTime) setSelectedTime(newTime);
  };

  // Submit to DB to store
  const submit = async () => {
    try {
        if (!user) throw new Error("User not logged in");
        if (!dropdownValue) {
            Alert.alert("Error", "Please select a symptom.");
            return;
        }

        // Combine date & time into one Date object
        const finalDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        );

        console.log(finalDateTime);

        // Call Firestore function to save data
        await recordSymptom(user.uid, dropdownValue, barSelected-1, finalDateTime);

        Alert.alert("Success", "Symptom recorded successfully!"); 
    } catch (error) {
        Alert.alert("Error", error.message);
    }
};


  return (
    <ScreenWrapper>
        <View className="flex-1 items-center justify-center">

            <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
                <Text className="text-2xl font-pbold text-center">What are you feeling today?</Text>
                
                <View className="pt-2">
                    <Text className="font-pbold text-lg">Symptom:</Text>
                    <View className="pt-3">
                        <CustomDropdown
                            value={dropdownValue}
                            setValue={setDropdownValue}
                            isFocus={isFocus}
                            setIsFocus={setIsFocus}
                            data={data}
                            placeholder="Select"
                            searchPlaceholder="Search..."
                        />
                    </View>
                </View>

                <View className="pt-4">
                    <Text className="font-pbold text-lg">Severity:</Text>
                    <ProgressBar selected={barSelected} setSelected={setBarSelected} containerStyle="py-3" />
                </View>

                <View className="pt-4">
                    <Text className="font-pbold text-lg">Date & Time Occurred:</Text>
                    <View className="w-full flex-row justify-start py-2">
                        <DateTimePicker
                            value={selectedDate}
                            mode={"date"}
                            is24Hour={true}
                            onChange={onDateChange}
                        />
                        <DateTimePicker
                            value={selectedTime}
                            mode={"time"}
                            is24Hour={true}
                            onChange={onTimeChange}
                        />
                    </View>
                </View>

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

export default Symptoms