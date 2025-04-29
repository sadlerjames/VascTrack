import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Card from '../../../components/Card';
import ScreenWrapper from '../../../components/ScreenWrapper';
import CustomDropdown from '../../../components/CustomDropdown';
import CustomButton from '../../../components/CustomButton';

import { getUserMedications } from '../../../lib/fetch';
import { predefinedMedications } from '../../../constants/medicationData';
import { useGlobalContext } from '../../../context/GlobalProvider';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ReminderScreen() {
  const { user } = useGlobalContext();
  const [isFocus, setIsFocus] = useState(false);

  const [reminders, setReminders] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medicationList, setMedicationList] = useState(predefinedMedications);
  const [body, setBody] = useState('');
  const [time, setTime] = useState(new Date());
  const [isDaily, setIsDaily] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Set up listeners for reminders
  useEffect(() => {
    // Load saved reminders
    loadReminders();
    
    // Request notification permissions
    checkNotificationPermissions();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // console.log('Notification received:', notification);
      
      // Get the identifier of the delivered notification
      const deliveredId = notification.request.identifier;
      
      // Check if this is a one-time reminder
      const deliveredReminder = reminders.find(reminder => reminder.id === deliveredId);
      
      // If it exists and is not a daily reminder, remove it
      if (deliveredReminder && !deliveredReminder.isDaily) {
        // console.log('Removing one-time reminder after delivery:', deliveredId);
        
        // Remove from state and storage
        const updatedReminders = reminders.filter(reminder => reminder.id !== deliveredId);
        setReminders(updatedReminders);
        saveReminders(updatedReminders);
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [reminders]);

  // Get users medication to put in dropdown
  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) return;
      const userMedications = await getUserMedications(user.uid);
      setMedicationList([...predefinedMedications, ...userMedications]);
    };
    fetchMedications();
  }, [user]);
  

  const checkNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    setPermissionStatus(existingStatus);
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required", 
          "Please allow notifications to use the reminder feature.", 
          [{ text: "OK" }]
        );
      }
    }
    
    // Set up Android channel regardless of permission status
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('reminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
  };

  const saveReminders = async (updatedReminders) => {
    try {
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Failed to save reminders:', error);
    }
  };

  const scheduleNotification = async (reminder) => {
    if (permissionStatus !== 'granted') {
      Alert.alert("Permission Required", "Please allow notifications to schedule reminders.");
      await checkNotificationPermissions();
      return;
    }
    
    const { id, title, body, time, isDaily } = reminder;
    
    // Cancel any existing notification with the same ID
    await Notifications.cancelScheduledNotificationAsync(id);
    
    const scheduledTime = new Date(time);
    const now = new Date();
    const hours = scheduledTime.getHours();
    const minutes = scheduledTime.getMinutes();
  
    let trigger;
  
    if (isDaily) {
      trigger = {
        type: 'daily',
        hour: hours,
        minute: minutes,
        repeats: true,
      };
    } else {
      // One-time notification using calendar notification trigger
      const scheduledDateTime = new Date();
      scheduledDateTime.setHours(hours, minutes, 0, 0);
      
      // If time is in the past for today, schedule for tomorrow
      if (scheduledDateTime < now) {
        scheduledDateTime.setDate(scheduledDateTime.getDate() + 1);
      }
      
      const year = scheduledDateTime.getFullYear();
      const month = scheduledDateTime.getMonth() + 1;
      const day = scheduledDateTime.getDate();
      
      trigger = {
        type: 'calendar', 
        year: year,
        month: month,
        day: day,
        hour: hours,
        minute: minutes,
        second: 0,
        repeats: false
      };
      
      // console.log("Calendar trigger:", JSON.stringify(trigger));
    }
  
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: {
          title: title,
          body: body,
          sound: true,
        },
        trigger,
      });
  
      // console.log(`Scheduled notification "${title}" for ${isDaily ? 'daily at' : ''} ${scheduledTime}`);
      return true;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      Alert.alert("Error", "Failed to schedule notification. Try again later.");
      return false;
    }
  };
  

  const createReminder = async () => {
    if (!selectedMedication) {
      Alert.alert("Error", "Please choose a medication to be reminded of!");
      return;
    }

    var bodyText = "Take your medication now!"

    // Create a new reminder object
    const newReminder = {
      id: Date.now().toString(),
      title: selectedMedication,
      body: bodyText,
      time: time.toISOString(),
      isDaily,
      createdAt: new Date().toISOString(),
    };

    // Schedule the notification
    const success = await scheduleNotification(newReminder);
    
    if (success) {
      // Update state and storage
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      await saveReminders(updatedReminders);
      
      
      // Reset form
      setSelectedMedication(null);
      setBody('');
      setTime(new Date());
      setIsDaily(true);
      
      Alert.alert("Success", "Reminder created successfully");
    }
  };

  const deleteReminder = async (id) => {
    // Cancel the scheduled notification
    await Notifications.cancelScheduledNotificationAsync(id);
    
    // Remove from state and storage
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
  };

  // Updates time if change in time picker
  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Show permissions message if needed
  if (permissionStatus === 'denied') {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
            <Text className='text-2xl text-center mb-4 font-pbold'>Notification Permission Required</Text>
            <Text className='text-center mb-6 font-pregular'>
              This feature requires notification permissions. Please enable notifications for this app in your device settings.
            </Text>

            <View className="items-center">
              <CustomButton
                  title="Check Permission Again"
                  handlePress={checkNotificationPermissions}
                  containerStyles="w-3/4 bg-tertiary mt-3"
                  textStyles="text-2xl"
              />  
            </View>

          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <Card>
          <Text className='text-lg font-psemibold mb-3 text-gray-800'>Create New Reminder</Text>
                  
          <Text className='text-gray-600 font-pregular mb-1'>Select Medication</Text>
          <CustomDropdown
            value={selectedMedication}
            setValue={setSelectedMedication}
            isFocus={isFocus}
            setIsFocus={setIsFocus}
            data={medicationList}
            placeholder="Medication"
            searchPlaceholder="Search..."
          />

          <View className="mt-2">
            <Text className='text-gray-600 mb-1'>Time</Text>
            <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
            />
          </View>
          
          <View className='flex-row items-center mb-4 mt-3'>
              <TouchableOpacity
              className='mr-2'
              onPress={() => setIsDaily(!isDaily)}
              >
                  <View className={`h-6 w-6 rounded-md border border-gray-400 ${isDaily ? 'bg-blue-500 border-blue-500' : 'bg-white'}`}>
                      {isDaily && <Text className='text-white text-center'>✓</Text>}
                  </View>
              </TouchableOpacity>
              <Text className='text-gray-700'>Repeat daily</Text>
          </View>

          <CustomButton
            title="Create Reminder"
            handlePress={createReminder}
            containerStyles="w-full bg-tertiary mt-3"
            textStyles="text-2xl"
          />  
        
        
        </Card>
        <Card>
          {/* Reminders List */}
          <Text className='text-xl font-pbold mb-3 text-gray-800'>Your Reminders</Text>
          {reminders.length === 0 ? (
          <Text className='text-gray-500 italic'>No reminders set</Text>
          ) : (
          reminders.map(reminder => (
              <View key={reminder.id} className='bg-white rounded-lg p-4 shadow-sm mb-3 flex-row justify-between items-center'>
                  <View className='flex-1'>
                      <Text className='font-semibold text-lg'>{reminder.title}</Text>
                      {reminder.body ? <Text className='text-gray-600 mb-1'>{reminder.body}</Text> : null}
                      <View className='flex-row items-center'>
                          <Text className='text-gray-500'>{formatTime(reminder.time)}</Text>
                          {reminder.isDaily && <Text className='text-blue-500 ml-2'>Daily</Text>}
                      </View>
                  </View>
                  <TouchableOpacity
                      className='p-2'
                      onPress={() => deleteReminder(reminder.id)}
                  >
                      <Text className='text-red-500 font-semibold'>Delete</Text>
                  </TouchableOpacity>
              </View>
          ))
          )}
        </Card>
      </View>
    </ScreenWrapper>
  );
}