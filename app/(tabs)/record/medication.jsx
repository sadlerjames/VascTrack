import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { router, Link } from 'expo-router';

import { recordMedication } from '../../../lib/recording';
import { useGlobalContext } from '../../../context/GlobalProvider';

import ScreenWrapper from '../../../components/ScreenWrapper'
import CustomButton from '../../../components/CustomButton'
import CustomDropdown from '../../../components/CustomDropdown'

const Medication = () => {
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

  // Submit to DB to store
    const submit = async () => {
      try {
          if (!user) throw new Error("User not logged in");
          if (!dropdownValue) {
              Alert.alert("Error", "Please choose a medication");
              return;
          }
  
          // Call Firestore function to save data
          await recordMedication(user.uid, dropdownValue);
  
          Alert.alert("Success", "Medication successfully recorded!"); 
      } catch (error) {
          Alert.alert("Error", error.message);
      }
    };

  return (
    <ScreenWrapper>
        <View className="flex-1 items-center justify-center">

            <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
                <Text className="text-2xl font-pbold text-center">What medication did you take?</Text>
                
                <View className="pt-5 pb-4">
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

                <View className="justify-center flex-row gap-2 pb-2">
                  <Text className="font-psemibold text-lg">Medication not listed?</Text>
                  <Link href="/sign-in" className="font-pbold text-lg text-quaternary">Add</Link>
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