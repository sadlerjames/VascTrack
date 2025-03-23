import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react'

import ScreenWrapper from '../../components/ScreenWrapper'
import { useGlobalContext } from '../../context/GlobalProvider';
import { updateUserProfile, updateUserPassword } from '../../lib/update';
import { fetchUserDetails } from '../../lib/fetch'

import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton';

const Profile = () => {
  const { user, setUser, logout } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const userData = await fetchUserDetails(user.uid);
        setForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to load user details.');
      }
    };

    loadUserData();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserProfile(user.uid, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });

      if (form.password) {
        await updateUserPassword(form.password);
      }

      setUser({
        ...user,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <ScreenWrapper>
      <ScrollView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="w-full h-full items-center justify-center flex-1"
            > 
              <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
                  <View className="w-full justify-center px-4 my-3">
                    <Text className="text-2xl text-center text-black font-psemibold">Edit Profile</Text>

                    <FormField
                      title="First Name"
                      value={form.firstName}
                      handleChangeText={(n) => setForm({ ...form, firstName: n })}
                      otherStyles="mt-7"
                    />

                    <FormField
                      title="Last Name"
                      value={form.lastName}
                      handleChangeText={(n) => setForm({ ...form, lastName: n })}
                      otherStyles="mt-7"
                    />

                    <FormField
                      title="Email"
                      value={form.email}
                      handleChangeText={(e) => setForm({ ...form, email: e })}
                      otherStyles="mt-7"
                      keyboardType="email-address"
                    />

                    <FormField
                      title="New Password (optional)"
                      value={form.password}
                      handleChangeText={(p) => setForm({ ...form, password: p })}
                      otherStyles="mt-7"
                      secureTextEntry
                    />

                    <FormField
                      title="Confirm New Password"
                      value={form.confirmPassword}
                      handleChangeText={(cp) => setForm({ ...form, confirmPassword: cp })}
                      otherStyles="mt-7"
                      secureTextEntry
                    />

                    <CustomButton
                      title="Update Profile"
                      handlePress={handleUpdateProfile}
                      containerStyles="mt-7 bg-tertiary"
                      isLoading={isSubmitting}
                    />
                  </View>
                
          

                </View>

                <CustomButton
                  title="Sign Out"
                  handlePress={logout}
                  containerStyles="mt-2 w-11/12 bg-tertiary mb-4"
                />

              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

export default Profile