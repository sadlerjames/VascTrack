import { View, Text, FlatList, StatusBar, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'

import WaveHeader from '../../../components/Header'
import CustomButton from '../../../components/CustomButton'

const Medication = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const data = [
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
              <View className="bg-primary rounded-xl justify-center items-center py-6 px-1">
                <Text className="font-pbold text-2xl">What medication did you take?</Text>

                <View className="p-4">
                  <Dropdown
                    style={[ styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
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

export default Medication


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: 330
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