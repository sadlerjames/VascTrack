import { View, Text, FlatList, StatusBar, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'
import { Link, router } from 'expo-router';

import WaveHeader from '../../../components/Header'
import CustomButton from '../../../components/CustomButton'

const Medication = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const dropdownData = [
    { label: 'Paracetamol', value: '1' },
    { label: 'Ibuprofen', value: '2' },
    { label: 'Aspirin', value: '3' },
    { label: 'Amoxicillin', value: '4' },
    { label: 'Metformin', value: '5' },
    { label: 'Atorvastatin', value: '6' },
    { label: 'Omeprazole', value: '7' },
    { label: 'Loratadine', value: '8' },
];

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#ADE2FF" barStyle="dark-content" />
        <SafeAreaView style={{flex:1}}>
          <WaveHeader />
          <View style={{ flex: 1 }}>
            <View className="items-center justify-center w-full h-full" >
              <View className="bg-primary w-full rounded-3xl justify-center items-center py-6 px-1">
                <Text className="font-pbold text-2xl p-3">What medication did you take?</Text>

                <View className="p-4 w-full">
                  <Dropdown
                    style={[ styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={dropdownData}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Medications' : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setValue(item.value);
                      setIsFocus(false);
                    }}

                  />
                </View>

             
                <CustomButton
                  title="Record Dosage"
                  handlePress={() => router.push('/record/energy')}
                  containerStyles="w-full bg-secondary mt-3"
                  textStyles="text-2xl"
                /> 
               

                

                <View className="justify-center pt-5 flex-row gap-2">
                  <Text className="font-psemibold text-lg">Medication not listed?</Text>
                  <Link href="/sign-in" className="font-pbold text-lg text-quaternary">Add</Link>
                </View>
                   
              </View>

              <View className="bg-primary rounded-xl justify-center items-center py-6 px-1 mt-5">
                <Text className="font-pbold text-2xl">Current Reminders</Text>

                
              </View>

            </View>
            
          </View>
          
          
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Medication


const styles = StyleSheet.create({
  dropdown: {
    height: 55,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 9,
    width: '100%'
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});