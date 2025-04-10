import { View, Text, Alert, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Link } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { recordMedication, saveUserMedication } from '../../../lib/recording';
import { getUserMedications } from '../../../lib/fetch'
import { useGlobalContext } from '../../../context/GlobalProvider';
import { predefinedMedications } from '../../../lib/medicationData'

import ScreenWrapper from '../../../components/ScreenWrapper'
import CustomButton from '../../../components/CustomButton'
import CustomDropdown from '../../../components/CustomDropdown'
import FormField from '../../../components/FormField'

const Medication = () => {
  // Get user
  const { user } = useGlobalContext();

  // Dropdown
  const [dropdownValue, setDropdownValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [customMedication, setCustomMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [medicationList, setMedicationList] = useState(predefinedMedications);

  // Date + Time Picker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Stores only date
  const [selectedTime, setSelectedTime] = useState(new Date()); // Stores only time

  // Load user-added medications from Firebase
  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) return;
      const userMedications = await getUserMedications(user.uid);
      setMedicationList([...predefinedMedications, ...userMedications]);
    };
    fetchMedications();
  }, [user]);

  // Submit to DB to store
  const submit = async () => {
    try {
      if (!user) throw new Error("User not logged in");
      if (!dropdownValue) {
        Alert.alert("Error", "Please choose a medication");
        return;
      }
      if (!dosage) {
        Alert.alert("Error", "Please enter the dosage");
        return;
      }

      const finalMedication = dropdownValue === "Other" ? customMedication : dropdownValue;
      if (dropdownValue === "Other" && customMedication) {
        await saveUserMedication(user.uid, customMedication);
        setMedicationList([...medicationList, { label: customMedication, value: customMedication }]);
      }

      // Combine date and time into a single Date object
      const combinedDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0
      );

      await recordMedication(user.uid, finalMedication, dosage, combinedDateTime);
      Alert.alert("Success", "Medication successfully recorded!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // User changes the date
  const onDateChange = (event, newDate) => {
    if (newDate) setSelectedDate(newDate);
  };

  // User changes the time
  const onTimeChange = (event, newTime) => {
    if (newTime) setSelectedTime(newTime);
  };


  return (
    <ScreenWrapper>
        <View className="flex-1 items-center justify-center">

            <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
                <Text className="text-2xl font-pbold text-center">What medication did you take?</Text>
                
                <View className="pt-3 pb-2">
                    <CustomDropdown
                        value={dropdownValue}
                        setValue={setDropdownValue}
                        isFocus={isFocus}
                        setIsFocus={setIsFocus}
                        data={[...medicationList, { label: "Other", value: "Other" }]}
                        placeholder="Select a Medication"
                        searchPlaceholder="Search..."
                    />
                  {/* Custom Medication Input */}
                  {dropdownValue === "Other" && (
                    <FormField
                      title="Enter medication name:"
                      value={customMedication}
                      handleChangeText={setCustomMedication}
                      otherStyles="mt-4"
                      keyboardType="email-address"
                    />
                  )}
                </View>


                <View className="mt-3">
                  {/* Predefined doages */}
                  <Text className="font-pbold text-lg">Enter dosage:</Text>
                  <View className="flex-row justify-between mt-2">
                    <CustomButton
                      title="1mg"
                      handlePress={() => setDosage("1mg")}
                      containerStyles="bg-secondary px-2 py-1 mr-1"
                      textStyles="text-sm"
                    />
                    <CustomButton
                      title="5mg"
                      handlePress={() => setDosage("5mg")}
                      containerStyles="bg-secondary px-2 py-1 mr-1"
                      textStyles="text-sm"
                    />
                    <CustomButton
                      title="10mg"
                      handlePress={() => setDosage("10mg")}
                      containerStyles="bg-secondary px-2 py-1 mr-1"
                      textStyles="text-sm"
                    />
                    <CustomButton
                      title="30mg"
                      handlePress={() => setDosage("30mg")}
                      containerStyles="bg-secondary px-2 py-1"
                      textStyles="text-sm"
                    />
                  </View>

                  {/* Dosage Input */}
                  <View className="pb-4">
                    <FormField
                        title=""
                        value={dosage}
                        placeholder="E.g. 1mg"
                        handleChangeText={setDosage}
                        otherStyles=""
                        keyboardType="numeric"
                      />
                  </View>
                </View>

                <View className="pt-4">
                    <Text className="font-pbold text-lg">Date & Time Taken:</Text>
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

export default Medication