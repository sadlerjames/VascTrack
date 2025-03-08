import { View, Text } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';

import ScreenWrapper from '../../../components/ScreenWrapper'
import ProgressBar from '../../../components/ProgressBar'
import CustomButton from '../../../components/CustomButton'
import CustomDropdown from '../../../components/CustomDropdown'

const Energy = () => {
  // Dropdown
  const [value, setValue] = useState(null);
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
  const [selected, setSelected] = useState(0);

  // Date + Time Picker
  const [date, setDate] = useState(new Date());

  const onChange = (e, selectedDate) => {
    setDate(selectedDate);
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
                            value={value}
                            setValue={setValue}
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
                    <ProgressBar selected={selected} setSelected={setSelected} containerStyle="py-3" />
                </View>

                <View className="pt-4">
                    <Text className="font-pbold text-lg">Date & Time Occurred:</Text>
                    <View className="w-full flex-row justify-start py-2">
                        <DateTimePicker
                            value={date}
                            mode={"date"}
                            is24Hour={true}
                            onChange={onChange}
                        />
                        <DateTimePicker
                            value={date}
                            mode={"time"}
                            is24Hour={true}
                            onChange={onChange}
                        />
                    </View>
                </View>

                <View className="items-center">
                    <CustomButton
                        title="Record"
                        handlePress={() => router.push('/record/energy')}
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