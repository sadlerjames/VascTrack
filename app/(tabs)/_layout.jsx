import { Image, Dimensions } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';

import icons from '../../constants/icons';

const { width: screenWidth } = Dimensions.get('window');

const tabBarHeight = screenWidth < 375 ? 60 : 75; // Adaptive tab height

const TabIcon = ({ icon, color }) => (
  <Image
    source={icon}
    resizeMode="contain"
    className="w-9 h-9 mb-3"
    style={{ tintColor: color }}
  />
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          backgroundColor: '#ADE2FF',
          borderTopWidth: 1.5,
          height: tabBarHeight,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600', 
          fontFamily: 'font-psemibold', 
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabIcon icon={icons.home} color={color} />,
          tabBarLabel: 'Home',
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabIcon icon={icons.graph} color={color} />,
          tabBarLabel: 'Insights',
        }}
      />

      <Tabs.Screen
        name="record"
        options={{
          title: 'Record',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabIcon icon={icons.plus} color={color} />,
          tabBarLabel: 'Record',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabIcon icon={icons.profile} color={color} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
