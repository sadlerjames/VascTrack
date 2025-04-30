import { View, Text, Alert, TextInput } from 'react-native';
import { Link, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import Card from '../../../components/Card';
import ScreenWrapper from '../../../components/ScreenWrapper';
import ProgressBar from '../../../components/ProgressBar';
import CustomButton from '../../../components/CustomButton';
import CustomDropdown from '../../../components/CustomDropdown';
import FormField from '../../../components/FormField';

import { recordSymptom, saveCustomSymptom } from '../../../lib/recording';
import { fetchCustomSymptoms } from '../../../lib/fetch';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { predefinedSymptoms } from '../../../constants/symptomData';

const Symptoms = () => {
  const { user } = useGlobalContext();

  const [dropdownValue, setDropdownValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [note, setNote] = useState('');

  const [barSelected, setBarSelected] = useState(0);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const combinedSymptoms = [
    ...predefinedSymptoms,
    ...customSymptoms.map(symptom => ({ label: symptom, value: symptom })),
    { label: "Other", value: "other" }
  ];

  const onDateChange = (event, newDate) => {
    setShowDatePicker(false);
    if (newDate) setSelectedDate(newDate);
  };

  const onTimeChange = (event, newTime) => {
    setShowTimePicker(false);
    if (newTime) setSelectedTime(newTime);
  };

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

      await recordSymptom(user.uid, finalSymptom, barSelected - 1, finalDateTime, note);

      Alert.alert("Success", "Symptom recorded successfully!");
      setNote('');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <Card>
          <Text className="text-2xl font-pbold text-center">How are you feeling today?</Text>

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

            <View className="w-full flex-row justify-between py-2">
              <CustomButton
                title={selectedDate.toDateString()}
                handlePress={() => setShowDatePicker(true)}
                containerStyles="bg-secondary px-4 py-2 rounded-xl"
                textStyles="text-base"
              />
              <CustomButton
                title={selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                handlePress={() => setShowTimePicker(true)}
                containerStyles="bg-secondary px-4 py-2 rounded-xl"
                textStyles="text-base"
              />
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onDateChange}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onTimeChange}
              />
            )}
          </View>

          <View className="pt-4">
            <View className="flex-row">
              <Text className="font-pbold text-lg">Add a Note </Text>
              <Text className="text-lg">(optional)</Text>
              <Text className="font-pbold text-lg">:</Text>
            </View>
            <View className={`border-2 w-full min-h-16 px-4 bg-gray-300 rounded-2xl items-center flex-row border-gray-400`}>
              <TextInput
                className="flex-1 text-black font-psemibold text-base"
                value={note}
                placeholder="e.g. Felt worse after lunch"
                placeholderTextColor=""
                multiline
                onChangeText={setNote}
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
        </Card>
      </View>
    </ScreenWrapper>
  );
};

export default Symptoms;