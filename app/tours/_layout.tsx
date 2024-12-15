import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
export default function TourLayout() {
  return (
    <Stack>
    {/* <Stack.Screen
      name="index"
      options={{
        headerShown: false,
      }}
    /> */}
    <Stack.Screen
      name="search"
      options={{
        headerShown: false,
      }}/>
    <Stack.Screen
      name="all"
      options={{
        headerShown: false,
      }}/>
  </Stack>
  )
}