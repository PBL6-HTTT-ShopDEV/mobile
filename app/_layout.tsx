import { Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Stack } from 'expo-router'
import { useFonts } from '../hooks/useFonts'
import { FavoriteTourProvider } from '../hooks/FavouriteTourContext'
import { AuthProvider } from '../hooks/AuthContext'

const RootLayout = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    useFonts().then(() => setFontsLoaded(true));
  }, []);
  if (!fontsLoaded) return null;
  return (
    <AuthProvider>
    <FavoriteTourProvider><Stack>
      <Stack.Screen name='index' options={{headerShown: false}}/>
      <Stack.Screen name='(auth)' options={{headerShown: false}}/>
      <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
      <Stack.Screen name='tourDetail' options={{headerShown: false}}/>
      <Stack.Screen name='tours' options={{headerShown: false}}/>
    </Stack></FavoriteTourProvider>
    </AuthProvider>
  )
}

export default RootLayout