import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

import CustomDropdown from '../CustomDropdown'
import { fetchUserSymptoms } from '../../lib/fetch'


const SymptomGraph = () => {
  const [symptoms, setSymptoms] = useState([]); // Store user's symptom data
  const [selectedSymptom, setSelectedSymptom] = useState(null); // Selected symptom

  useEffect(() => {
    const getSymptoms = async () => {
      const data = await fetchUserSymptoms();
      setSymptoms(data);
    };
    getSymptoms();
  }, []);



  return (
    <View>
      <Text>SymptomGraph</Text>
    </View>
  )
}

export default SymptomGraph