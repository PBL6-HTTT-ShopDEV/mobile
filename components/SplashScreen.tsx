import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, ImageBackground } from 'react-native';

export default function SplashScreen({ onFinish }) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <ImageBackground 
      source={require('../assets/images/bg-heroBanner.png')}
      style={styles.container}
    >
      <Animated.Image
        source={require('../assets/images/splash.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
          },
        ]}
        resizeMode="contain"
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
}); 