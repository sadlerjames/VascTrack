import { View, Text, FlatList, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import WaveHeader from '../../components/Header'

const Home = () => {
  return (

    <SafeAreaProvider>
    
      <StatusBar backgroundColor="#ADE2FF" barStyle="dark-content" />

        <SafeAreaView>
          <FlatList
            data={[{id: 1}, {id: 2}, {id: 3}]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
              <Text className="text-3xl">{item.id}</Text>
            )}
            ListHeaderComponent={() => (<WaveHeader />)}
          />

        </SafeAreaView>

    </SafeAreaProvider>
  )
}

export default Home