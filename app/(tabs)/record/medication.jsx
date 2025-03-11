import { View, Text, Alert, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Link } from 'expo-router';

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

      await recordMedication(user.uid, finalMedication, dosage);
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


                {/* Dosage Input */}
                <View className="pb-4">
                  <FormField
                      title="Enter dossage:"
                      value={dosage}
                      placeholder="E.g. 500mg"
                      handleChangeText={setDosage}
                      otherStyles="mt-4"
                      keyboardType="numeric"
                    />
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