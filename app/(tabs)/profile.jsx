import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';

import ScreenWrapper from '../../components/ScreenWrapper';
import { useGlobalContext } from '../../context/GlobalProvider';
import { updateUserProfile, updateUserPassword } from '../../lib/update';
import { fetchUserDetails } from '../../lib/fetch';

import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const Profile = () => {
  const { user, setUser, logout } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    sex: '',
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
          dob: userData.dob || '',
          sex: userData.sex || '',
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
        dob: form.dob,
        sex: form.sex,
      });

      if (form.password) {
        await updateUserPassword(form.password);
      }

      setUser({
        ...user,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        dob: form.dob,
        sex: form.sex,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

                  {/* Date of Birth */}
                  <Text className="text-base text-black font-pmedium mt-7">Date of Birth</Text>
                  <CustomButton
                    title={form.dob ? form.dob : "Select Date"}
                    handlePress={() => setShowDatePicker(true)}
                    containerStyles="mt-2 bg-gray-300 border-2 border-gray-400"
                  />
                  {showDatePicker && (
                    <DateTimePicker
                      value={form.dob ? new Date(form.dob) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setForm({ ...form, dob: selectedDate.toISOString().split('T')[0] });
                        }
                      }}
                    />
                  )}

                  {/* Sex Selection */}
                  <View className="mt-7">
                      <Text className="text-base text-black font-pmedium">Sex</Text>
                      <View className="border-2 border-gray-400 rounded-lg h-10">
                        <Picker
                          selectedValue={form.sex}
                          onValueChange={(value) => setForm({ ...form, sex: value })}
                          style={{ height: '100%', width: '100%' }}
                          mode="dropdown"
                        >
                          <Picker.Item label="Select" value="" />
                          <Picker.Item label="Male" value="male" />
                          <Picker.Item label="Female" value="female" />
                          <Picker.Item label="Other" value="other" />
                        </Picker>
                      </View>
                    </View>

                  <FormField
                    title="New Password"
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
  );
};

export default Profile;