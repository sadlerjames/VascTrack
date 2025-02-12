// Seperate layout for auth as user won't have access to nav when not signed in

import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import React from 'react'

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  )
}

export default AuthLayout