import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs, Redirect } from 'expo-router';

import icons from '../../constants/icons';

const TabIcon = ({icon, color, name, focused}) => {
  return(
    <View className="items-center justify-center w-full py-1">
      <Image 
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6 mb-1"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs text-center`} adjustsFontSizeToFit={true} minimumFontScale={0.8} >
        {name}
      </Text>
    </View>
  ) 
}

const TabsLayout = () => {
  return (
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#ADE2FF',
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 8,
            paddingHorizontal: 5
          },
          tabBarItemStyle: {
            paddingVertical: 5,
            flex: 1,
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