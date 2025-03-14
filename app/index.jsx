import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGlobalContext } from '../context/GlobalProvider';

import images from '../constants/images';
import CustomButton from "../components/CustomButton";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href="/home" />

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}> 
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            className="w-[340px] h-[294px]"
            resizeMode="contain" 
          />

          <View className="relative">
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
            containerStyles="w-full mt-7 bg-tertiary"
          />
          {/* Skip the sign in for testing */}
          {/* <CustomButton
            title="Home"
            handlePress={() => router.push('/home')}
            containerStyles="w-full mt-7 bg-tertiary"
          /> */}
            
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}