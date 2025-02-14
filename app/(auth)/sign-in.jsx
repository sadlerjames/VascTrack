import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router';

import { getCurrentUser, signIn } from '../../lib/authentication';
import { useGlobalContext } from "../../context/GlobalProvider";

import images from '../../constants/images';

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const SignIn = () => {
  const { setUser, setisLoggedIn } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

const submit = async () => {
  if(!form.email || !form.password) {
    Alert.alert('Error', 'Please fill in all the fields!');
  }

  setIsSubmitting(true);

  try {

    await signIn(form.email, form.password);
    const result = await getCurrentUser();

    setUser(result);
    setisLoggedIn(true);

    router.replace('/home');
    
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setIsSubmitting(false); // loading has finished
  }
}

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-3">
          <View className="items-center">
            <Image 
              source={images.logo}
              resizeMode='contain'
              className="w-[215px] h-[170px]"
            />
          </View>
          

          <Text className="text-2xl text-black font-psemibold mt-3">Sign In</Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(p) => setForm({ ...form, password: p})}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="font-psemibold text-lg">Don't have an account?</Text>
            <Link href="/sign-up" className="font-pbold text-lg text-quaternary">Sign Up</Link>
          </View>
        </View>
      </ScrollView>


    </SafeAreaView>
  )
}

export default SignIn