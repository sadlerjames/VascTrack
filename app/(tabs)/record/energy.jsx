import { View, Text, FlatList, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import WaveHeader from '../../../components/Header'

const Energy = () => {
  return (

    <SafeAreaProvider>
      <StatusBar backgroundColor="#ADE2FF" barStyle="dark-content" />

        <SafeAreaView style={{flex:1}}>
          <WaveHeader />
          <View style={{ flex: 1 }}>
            <View className="items-center justify-center w-full h-full" >
              <Text>Energy</Text>

            </View>
            
          </View>
          
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Energy