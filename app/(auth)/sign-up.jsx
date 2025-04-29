import { View, Text, ScrollView, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router';

import { createUser, signInWithGoogle } from '../../lib/authentication';
import { useGlobalContext } from "../../context/GlobalProvider";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import GoogleSignIn from '../../components/GoogleSignIn';

import images from '../../constants/images';

const SignUp = () => {
  const { setUser, setisLoggedIn } = useGlobalContext();
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })


const submit = async () => {
  if(!form.email || !form.password || !form.confirmPassword || !form.firstName || !form.lastName) {
    Alert.alert('Error', 'Please fill in all the fields!');
  }

  setIsSubmitting(true);

  if (form.password == form.confirmPassword) {
    try {

      const result = await createUser(form.email, form.password, form.firstName, form.lastName);
      
      if (result) {
        setUser(result);
        setisLoggedIn(true);
        router.replace('/home');
      }
      
    } catch (error) {
      // Handle firebase error message with custom response
      if (error.message.includes('Password should be at least 6 characters')) {
        Alert.alert('Error', 'Password should be at least 6 characters. Please choose a longer password!');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setIsSubmitting(false); // loading has finished
    }

  } else {
    Alert.alert('Error', 'Passwords do not match! Please enter the same password.');
    setIsSubmitting(false);
  }

}

const googleSignIn = async () => {
  try {
    const googleUser = await signInWithGoogle();
    setUser(googleUser);
    setisLoggedIn(true);
    router.replace('/home');
  } catch (error) {
    Alert.alert("Google Sign-In Failed", error.message);
  }
};

  return (
    <SafeAreaView className="bg-primary h-full">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="w-full justify-center h-full px-4 my-3">
              {/* <View className="items-center">
                <Image 
                  source={images.logo}
                  resizeMode='contain'
                  className="w-[215px] h-[170px]"
                />
              </View> */}
              
              <View className="items-center">
                <Text className="text-2xl text-black font-psemibold mt-3">Sign Up</Text>
              </View>

              <FormField
                title="First name"
                value={form.firstName}
                handleChangeText={(n) => setForm({ ...form, firstName: n})}
                otherStyles="mt-7"
                keyboardType="email-address"
              />

              <FormField
                title="Last name"
                value={form.lastName}
                handleChangeText={(n) => setForm({ ...form, lastName: n})}
                otherStyles="mt-7"
                keyboardType="email-address"
              />

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

              <FormField
                title="Confirm password"
                value={form.confirmPassword}
                handleChangeText={(cp) => setForm({ ...form, confirmPassword: cp})}
                otherStyles="mt-7"
              />

              <CustomButton
                title="Sign Up"
                handlePress={submit}
                containerStyles="mt-7 bg-tertiary"
                isLoading={isSubmitting}
              />

              <View className="justify-center pt-5 flex-row gap-2">
                <Text className="font-psemibold text-lg">Already have an account?</Text>
                <Link href="/sign-in" className="font-pbold text-lg text-quaternary">Sign In</Link>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default SignUp