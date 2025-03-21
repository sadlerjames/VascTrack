import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrapper from '../../../components/ScreenWrapper';
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
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDaily, setIsDaily] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Load saved reminders
    loadReminders();
    
    // Request notification permissions
    checkNotificationPermissions();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
    
    // Get hours and minutes from the time
    const scheduledTime = new Date(time);
    const hours = scheduledTime.getHours();
    const minutes = scheduledTime.getMinutes();
    
    // Create a trigger
    let trigger;
    
    if (isDaily) {
      // Daily notification at specific time
      trigger = {
        hour: hours,
        minute: minutes,
        repeats: true,
      };
    } else {
      // One-time notification
      const now = new Date();
      const scheduledDateTime = new Date();
      scheduledDateTime.setHours(hours, minutes, 0, 0);
      
      // If time is in the past for today, schedule for tomorrow
      if (scheduledDateTime < now) {
        scheduledDateTime.setDate(scheduledDateTime.getDate() + 1);
      }
      
      trigger = scheduledDateTime;
    }
    
    try {
      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: {
          title: title,
          body: body,
          sound: true,
        },
        trigger,
      });
      
      console.log(`Scheduled notification "${title}" for ${isDaily ? 'daily at' : ''} ${hours}:${minutes}`);
      return true;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      Alert.alert("Error", "Failed to schedule notification. Try again later.");
      return false;
    }
  };

  const createReminder = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a reminder title");
      return;
    }

    // Create a new reminder object
    const newReminder = {
      id: Date.now().toString(),
      title,
      body,
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
      setTitle('');
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

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
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
      <View className='flex-1 bg-gray-100 p-4 justify-center items-center'>
        <Text className='text-xl text-center mb-4'>Notification Permission Required</Text>
        <Text className='text-center mb-6'>
          This feature requires notification permissions. Please enable notifications for this app in your device settings.
        </Text>
        <TouchableOpacity 
          className='bg-blue-500 rounded-md py-3 px-4'
          onPress={checkNotificationPermissions}
        >
          <Text className='text-center text-white font-semibold'>Check Permission Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
            <ScrollView className="w-11/12 bg-primary p-6 rounded-2xl mb-4">
                <Text className='text-2xl font-bold mb-6 font-pbold'>Reminder Settings</Text>
                {/* Reminder Form */}
                <View className='bg-white rounded-lg p-4 shadow-md mb-6'>
                    <Text className='text-lg font-psemibold mb-3 text-gray-800'>Create New Reminder</Text>
                    
                    <Text className='text-gray-600 font-pregular mb-1'>Title</Text>
                    <TextInput
                        className='border border-gray-300 rounded-md p-2 mb-3'
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g., Take medication"
                    />

                    <Text className='text-gray-600 font-pregular mb-1'>Message (optional)</Text>
                    <TextInput
                        className='border border-gray-300 rounded-md p-2 mb-3'
                        value={body}
                        onChangeText={setBody}
                        placeholder="Additional details"
                        multiline
                    />

                    <Text className='text-gray-600 mb-1'>Time</Text>
                    <TouchableOpacity
                        className='border border-gray-300 rounded-md p-2 mb-3'
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={handleTimeChange}
                        />
                    )}
                    <View className='flex-row items-center mb-4'>
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

                    <TouchableOpacity
                        className='bg-blue-500 rounded-md py-3 px-4'
                        onPress={createReminder}
                    >
                        <Text className='text-center text-white font-semibold'>Create Reminder</Text>
                    </TouchableOpacity>
                </View>

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
            </ScrollView>
        </View>
    </ScreenWrapper>
  );
}