import { View, Text, Alert, TextInput } from 'react-native'
import { Link, router } from 'expo-router';
import React, { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';

import ScreenWrapper from '../../../components/ScreenWrapper'
import ProgressBar from '../../../components/ProgressBar'
import CustomButton from '../../../components/CustomButton'
import CustomDropdown from '../../../components/CustomDropdown'
import FormField from '../../../components/FormField'

import { recordSymptom, saveCustomSymptom } from '../../../lib/recording';
import { fetchCustomSymptoms } from '../../../lib/fetch'
import { useGlobalContext } from '../../../context/GlobalProvider';

const Symptoms = () => {    
  // Get user
  const { user } = useGlobalContext();
  // Dropdown
  const [dropdownValue, setDropdownValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');

  // Progress Bar
  const [barSelected, setBarSelected] = useState(0);

  // Date + Time Picker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Stores only date
  const [selectedTime, setSelectedTime] = useState(new Date()); // Stores only time

  // Get users custom symptoms
  useEffect(() => {
    const loadCustomSymptoms = async () => {
      if (!user) return;
      try {
        const fetchedSymptoms = await fetchCustomSymptoms(user.uid);
        setCustomSymptoms(fetchedSymptoms);
      } catch (error) {
        console.error("Error loading custom symptoms:", error);
      }
    };
    loadCustomSymptoms();
  }, [user]);

  const predefinedSymptoms = [
    { label: "Headache", value: "Headache" },
    { label: "Fatigue", value: "Fatigue" },
    { label: "Nausea", value: "Nausea" },
    { label: "Dizziness", value: "Dizziness" },
    { label: "Cough", value: "Cough" },
    { label: "Shortness of Breath", value: "Shortness of Breath" },
    { label: "Chest Pain", value: "Chest Pain" },
    { label: "Muscle Aches", value: "Muscle Aches" }
  ];

  const combinedSymptoms = [
    ...predefinedSymptoms,
    ...customSymptoms.map(symptom => ({ label: symptom, value: symptom })),
    { label: "Other", value: "other" } // Allows user to enter a custom symptom
  ];

  // User changes the date
  const onDateChange = (event, newDate) => {
    if (newDate) setSelectedDate(newDate);
  };

  // User changes the time
  const onTimeChange = (event, newTime) => {
    if (newTime) setSelectedTime(newTime);
  };

  // Submit to DB to store
  const submit = async () => {
    try {
        if (!user) throw new Error("User not logged in");

        let finalSymptom = dropdownValue;
        if (dropdownValue === "other") {
            if (!newSymptom.trim()) {
            Alert.alert("Error", "Please enter a symptom.");
            return;
            }
            finalSymptom = newSymptom.trim();

            // Save new symptom to Firestore
            await saveCustomSymptom(user.uid, finalSymptom);
            setCustomSymptoms(prev => [...prev, finalSymptom]);
        }

        const finalDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        );

        await recordSymptom(user.uid, finalSymptom, barSelected - 1, finalDateTime);

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
                            data={combinedSymptoms}
                            placeholder="Select"
                            searchPlaceholder="Search..."
                        />
                    </View>
                </View>

                {dropdownValue === "other" && (
                  <FormField
                    title="Enter Symptom:"
                    value={newSymptom}
                    handleChangeText={setNewSymptom}
                    otherStyles="mt-4"
                    keyboardType="email-address"
                  />
                )}

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