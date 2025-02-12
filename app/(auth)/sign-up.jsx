import { View, Text, ScrollView, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router';

import images from '../../constants/images';

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

const [isSubmitting, setIsSubmitting] = useState(false)

const submit = () => {

}

  return (
    <SafeAreaView className="bg-primary h-full">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="w-full justify-center h-full px-4 my-3">
              <View className="items-center">
                <Image 
                  source={images.logo}
                  resizeMode='contain'
                  className="w-[215px] h-[170px]"
                />
              </View>
              

              <Text className="text-2xl text-black font-psemibold mt-3">Sign Up</Text>

              <FormField
                title="First Name"
                value={form.firstName}
                handleChangeText={(n) => setForm({ ...form, firstName: n})}
                otherStyles="mt-7"
                keyboardType="email-address"
              />

              <FormField
                title="Last Name"
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
                title="Confirm Password"
                value={form.confirmPassword}
                handleChangeText={(cp) => setForm({ ...form, confirmPassword: cp})}
                otherStyles="mt-7"
              />

              <CustomButton
                title="Sign Up"
                handlePress={submit}
                containerStyles="mt-7"
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