import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import SignIn from '../app/(auth)/sign-in';
import SplashScreen from '../components/SplashScreen';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated]);

  const handleFinishLoading = () => {
    setIsLoading(false);
  };

  return isLoading ? (
    <SplashScreen onFinish={handleFinishLoading} />
  ) : (
    <SignIn />
  );
}
