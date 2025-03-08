import { View, Text, StatusBar, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import WaveHeader from '../../../components/Header'
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
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#ADE2FF" barStyle="dark-content" />

        <SafeAreaView style={{flex:1}}>
          <WaveHeader />
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
              <View>
                <ProgressBar selected={selected} setSelected={setSelected} />
              </View>
              <View className="items-center">
                <CustomButton
                  title="Record"
                  handlePress={() => router.push('/record/energy')}
                  containerStyles="w-80 bg-secondary mt-3"
                  textStyles="text-2xl"
                />  
              </View>

            </View>
          </View>
          
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Energy