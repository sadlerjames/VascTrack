import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import { Tabs, Redirect } from 'expo-router';

import icons from '../../constants/icons';

const { width: screenWidth } = Dimensions.get('window');

const TabIcon = ({icon, color, name, focused}) => {
  return(
    <View className="w-full items-center justify-center">
      <View>
        <Image 
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className="w-7 h-7 mb-1"
        />
      </View>
      <View>
        <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-s`} numberOfLines={1} >
          {name}
        </Text>
      </View>
    </View>
  ) 
}

const TabsLayout = () => {
  const tabBarHeight = screenWidth < 375 ? 60 : 75; // Calculate tab height based on width
  return (
      <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ADE2FF',
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: 10,
          paddingHorizontal: 0
        },
        tabBarItemStyle: {
          paddingVertical: 10,
          paddingHorizontal: 0,
          minWidth: 80,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }
      }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.graph}
                color={color}
                name="Insights"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name="record"
          options={{
            title: 'Record',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Record"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
  );
}

export default TabsLayout