import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { styled } from 'nativewind';
import Button from './Button';
import HodophileLogo from './HodophileLogo';
import CustomInput from './CustomInput';
import SocialLoginButtons from './SocialLoginButtons';
import { Link } from 'expo-router';
// Import các component khác ở đây
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);


const components = {
  Button,
  HodophileLogo,
  CustomInput,
  SocialLoginButtons
};

const Playground = () => {
  const [currentComponent, setCurrentComponent] = useState('Button');
  const Component = components[currentComponent];

  return (
    <StyledScrollView className="flex-1 bg-gray-100">
      <StyledView className="p-4">
        <StyledText className="text-2xl font-bold mb-4">Playground</StyledText>
        <StyledView className="flex-row flex-wrap mb-4">
          {Object.keys(components).map((name) => (
            <Button
              key={name}
              title={name}
              onPress={() => setCurrentComponent(name)}
              className={`mr-2 mb-2 ${currentComponent === name ? 'bg-blue-600' : 'bg-blue-400'}`}
            />
          ))}
        </StyledView>

        <StyledView className="bg-black p-4 rounded-lg shadow-md">
          <StyledText className="bg-blue text-lg font-semibold mb-2">
            {currentComponent}
          </StyledText>
          <StyledView className="items-center">
            {currentComponent === 'Button' && (
              <Button
                title="Sample Button"
                onPress={() => console.log('Button pressed')}
              />
            )}
            {currentComponent === 'HodophileLogo' && (
              <HodophileLogo
                width={100}
                height={100}
                style={{ alignSelf: 'center', marginBottom: 20 }}
              />
            )}
            {currentComponent === 'CustomInput' && (
              <CustomInput
                containerClassName="bg-white rounded-text-input px-5 py-3 mb-4 mx-4 mt-4"
                inputClassName="text-base text-gray-800 placeholder-gray-400 h-full"
                placeholder="Enter text"
                value="Sample text"
                onChangeText={(text) => console.log('Text changed:', text)}
              />
            )}
            {currentComponent === 'SocialLoginButtons' && (
              <SocialLoginButtons
                onFacebookLogin={() => console.log('Facebook login')}
                onGoogleLogin={() => console.log('Google login')}
                onTwitterLogin={() => console.log('Twitter login')}
              />
            )}
            <Link href="/(auth)/sign-in" asChild>
              <Pressable className="bg-blue-500 p-3 rounded-lg">
                <Text className="text-white text-center">Go to SignIn</Text>
              </Pressable>
            </Link>
            <Link href="/(tabs)/home" asChild>
              <Pressable className="bg-blue-500 p-3 rounded-lg">
                <Text className="text-white text-center">Go to Home</Text>
              </Pressable>
            </Link>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
};

export default Playground;