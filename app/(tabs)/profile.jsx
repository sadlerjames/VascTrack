import { View, Text, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Modal, FlatList } from 'react-native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import ScreenWrapper from '../../components/ScreenWrapper';
import { useGlobalContext } from '../../context/GlobalProvider';
import { updateUserProfile, updateUserPassword } from '../../lib/update';
import { fetchUserDetails } from '../../lib/fetch';
import { deleteAccount } from '../../lib/delete';

import Card from '../../components/Card';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const Profile = () => {
  const { user, setUser, logout } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [showSexPicker, setShowSexPicker] = useState(false);

  const sexOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" }
  ];

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

  // Format the date as day/month/year
  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is permanent.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              await logout();        
            } catch (error) {
              console.error("Error during account deletion:", error);
              Alert.alert("Error", "Failed to delete account.");
            }
          }
        }
      ]
    );
  };
  



  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full h-full items-center justify-center flex-1"
          >
            <Card>
              <View className="w-full justify-center px-4 my-3">
                <Text className="text-2xl font-pbold text-center">Edit Profile</Text>

                <FormField
                  title="First name:"
                  value={form.firstName}
                  handleChangeText={(n) => setForm({ ...form, firstName: n })}
                  otherStyles="mt-7"
                />

                <FormField
                  title="Last name:"
                  value={form.lastName}
                  handleChangeText={(n) => setForm({ ...form, lastName: n })}
                  otherStyles="mt-7"
                />

                <FormField
                  title="Email:"
                  value={form.email}
                  handleChangeText={(e) => setForm({ ...form, email: e })}
                  otherStyles="mt-7"
                  keyboardType="email-address"
                />

                {/* DOB Picker */}
                <Text className="text-base text-black font-pmedium mt-7">Date of Birth (optional):</Text>
                <TouchableOpacity 
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                    className={`rounded-xl h-16 justify-center px-4 bg-gray-300 border-2 border-gray-400`}
                >
                    <Text className={`text-black font-psemibold text-base`}>
                      {form.dob ? formatDate(new Date(form.dob)) : "Select Date"}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showDatePicker}
                  >
                    <View className="flex-1 justify-end bg-black/50">
                      <View className="bg-white p-4 rounded-t-xl">
                        <View className="flex-row justify-between mb-4">
                          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Text className="text-blue-500 font-bold text-lg">Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            setShowDatePicker(false);
                            setForm({ ...form, dob: tempDate.toISOString().split('T')[0] });
                          }}>
                            <Text className="text-blue-500 font-bold text-lg">Confirm</Text>
                          </TouchableOpacity>
                        </View>
                        
                        <DateTimePicker
                          value={tempDate}
                          mode="date"
                          display="spinner"
                          onChange={(event, selectedDate) => {
                            if (selectedDate) {
                              setTempDate(selectedDate);
                            }
                          }}
                          style={{ height: 200 }}
                        />
                        {/* Extra white padding on the bottom */}
                        <View className="h-10 bg-white" /> 
                      </View>
                    </View>
                  </Modal>
                )}

                {/* Sex Picker */}
                <View className="mt-7">
                  <Text className="text-base text-black font-pmedium">Sex (optional):</Text>
                  <TouchableOpacity
                    onPress={() => setShowSexPicker(true)}
                    activeOpacity={0.7}
                    className="border-2 border-gray-400 rounded-xl h-16 justify-center px-4 bg-gray-300"
                  >
                    <Text className="text-black font-psemibold text-base">
                      {form.sex ? sexOptions.find(option => option.value === form.sex)?.label : "Select"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showSexPicker && (
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSexPicker}
                  >
                    <View className="flex-1 justify-end bg-black/50">
                      <View className="bg-white rounded-t-xl">
                        <View className="p-4 border-b border-gray-200">
                          <Text className="text-black font-bold text-xl text-center">Select Sex</Text>
                        </View>
                        
                        <FlatList
                          data={sexOptions}
                          keyExtractor={(item) => item.value}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              className={`p-4 border-b border-gray-100 ${form.sex === item.value ? 'bg-gray-100' : ''}`}
                              onPress={() => {
                                setForm({ ...form, sex: item.value });
                                setShowSexPicker(false);
                              }}
                            >
                              <Text className="text-black text-lg text-center">{item.label}</Text>
                            </TouchableOpacity>
                          )}
                        />
                        
                        <TouchableOpacity
                          className="p-4 border-t border-gray-200"
                          onPress={() => setShowSexPicker(false)}
                        >
                          <Text className="text-blue-500 font-bold text-lg text-center">Cancel</Text>
                        </TouchableOpacity>
                        
                        {/* Extra padding view to extend white background to bottom of screen */}
                        <View className="h-10 bg-white" />
                      </View>
                    </View>
                  </Modal>
                )}

                <FormField
                  title="New password (optional):"
                  value={form.password}
                  handleChangeText={(p) => setForm({ ...form, password: p })}
                  otherStyles="mt-7"
                  secureTextEntry
                />

                <FormField
                  title="Confirm new password (optional):"
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
            </Card>

            <CustomButton
              title="Sign Out"
              handlePress={logout}
              containerStyles="mt-2 w-11/12 bg-tertiary mb-4"
            />

            <CustomButton
              title="Delete Account"
              handlePress={handleDeleteAccount}
              containerStyles="mt-2 w-11/12 bg-red-400 mb-4"
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
      
    </ScreenWrapper>
  );
};

export default Profile;