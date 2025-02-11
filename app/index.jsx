import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import images from '../constants/images';
import CustomButton from "../components/CustomButton";

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}> 
        <View className="w-full items-center min-h-[85vh] px-4">
        {/* Maybe add justify center  */}
          <Image
            source={images.logo}
            className="w-[340px] h-[294px]"
            resizeMode="contain" 
          />

          <View className="relative mt-3">
            <Text className="text-5xl text-black font-pbold text-center">
              Track
            </Text>
            <Text className="text-5xl text-black font-pbold text-center mt-5">
              Manage
            </Text>
            <Text className="text-5xl text-black font-pbold text-center mt-5">
              Feel Better
            </Text>
          </View>
          <Text className="font-psemibold text-xl mt-8 text-center">
            Designed for vasculitis patients, VascTrack makes managing your condition easier every day
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />
            
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}