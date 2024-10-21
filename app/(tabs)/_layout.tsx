import { View, Text } from 'react-native'
import React from 'react'
import {Tabs, Redirect  } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/build/AntDesign';
import { FontAwesome6 } from '@expo/vector-icons';
const TabLayout = () => {
  return (
    <>
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#000',
            tabBarStyle: {
              position: 'absolute',
              elevation: 0,
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              height: 90,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 1,
              shadowRadius: 10,
            }
        }}
        >
            <Tabs.Screen
              name='home'
              options={{
                title: 'Trang chính',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen name='favourite-tour' options={{title:'Yêu thích',headerShown: false,tabBarIcon: ({ color, size }) => (
                  <AntDesign name="hearto" size={size} color={color} />
                ),}}></Tabs.Screen>
            <Tabs.Screen name='schedule' options={{title:'Lịch trình',headerShown: false,tabBarIcon: ({ color, size }) => (
                  <Ionicons name="calendar-outline" size={size} color={color} />
                ),}}></Tabs.Screen>
            <Tabs.Screen name='profile' options={{title:'Hồ sơ',headerShown: false,tabBarIcon: ({ color, size }) => (
                  <FontAwesome6 name="user" size={size} color={color} />
                ),}}></Tabs.Screen>
        </Tabs>
    </>
  )
}

export default TabLayout