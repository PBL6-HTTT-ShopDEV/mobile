import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, SafeAreaView,Alert } from 'react-native';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';
import CustomInput from '../../components/CustomInput';
import HodophileLogo from '../../components/HodophileLogo';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/AuthContext';
import { LoginPayload } from '../../types/User.types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImageBackground = styled(ImageBackground);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledLinearGradient = styled(LinearGradient);

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, socialLogin, loading } = useAuth();
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      const credentials: LoginPayload = {
        email,
        password
      };
      await login(credentials);
    } catch (error) {
      Alert.alert('Lỗi đăng nhập', error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
    }
  };
  const handleForgotPassword = () => {
    console.log('Quên mật khẩu');
  };

  return (
    <StyledImageBackground
      source={require('../../assets/images/bg-heroBanner.png')}
      className="flex-1"
    >
      <StyledSafeAreaView className="flex-1 justify-top px-8">
        <StyledView className="items-center mb-4 mt-20">
          <HodophileLogo width={328} height={96} />
        </StyledView>
        <StyledLinearGradient
          colors={['#24BAEC', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="rounded-3xl p-6 mt-10"
        >
          <StyledView className="items-center">
            <CustomInput
              placeholder="Nhập email hoặc số điện thoại"
              value={email}
              onChangeText={setEmail}
              containerClassName="h-12"
              inputClassName="h-full font-vollkorn-regular"
            />
            <CustomInput
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              containerClassName="h-12"
              inputClassName="h-full font-vollkorn-regular"
            />
          </StyledView>
          <StyledView className="items-end">
            <StyledTouchableOpacity onPress={handleForgotPassword}>
              <StyledText className="font-vollkorn-regular text-blue-600 text-sm mb-12 mr-4">Quên mật khẩu?</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <Button className="font-vollkorn-regular" title="Đăng nhập" onPress={handleSignIn} />
          
          <StyledView className="flex-row justify-center mt-2 mb-12">
            <StyledText className="font-vollkorn-regular text-gray text-sm mb-12">Chưa là thành viên? </StyledText>
            <StyledTouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <StyledText className="font-vollkorn-regular text-blue text-sm mb-12">Đăng ký ngay</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <SocialLoginButtons className="mt-8" 
          onFacebookLogin={() => console.log('Facebook login')}
          onGoogleLogin={() => console.log('Google login')}
          onTwitterLogin={() => console.log('Twitter login')}
        />
        </StyledLinearGradient>
      </StyledSafeAreaView>
    </StyledImageBackground>
  );
};

export default SignIn;