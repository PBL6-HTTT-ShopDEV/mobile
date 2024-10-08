import * as Font from 'expo-font';

export const useFonts = async () =>
  await Font.loadAsync({
    'Vollkorn-Regular': require('../assets/fonts/Vollkorn-Regular.ttf'),
    'Vollkorn-Medium': require('../assets/fonts/Vollkorn-Medium.ttf'),
    'Vollkorn-Bold': require('../assets/fonts/Vollkorn-Bold.ttf'),
    'volkorn-boldItalic': require('../assets/fonts/Vollkorn-BoldItalic.ttf'),
    'Vollkorn-Italic': require('../assets/fonts/Vollkorn-Italic.ttf'),
  });