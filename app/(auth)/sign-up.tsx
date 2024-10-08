import { View, Text, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native'
import Button from '../../components/Button';
import React, { useEffect, useState } from 'react'
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import HodophileLogo from '../../components/HodophileLogo';
import CustomInput from '../../components/CustomInput';
import { router } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImageBackground = styled(ImageBackground);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledLinearGradient = styled(LinearGradient);
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (password !== confirmPassword) {
      setPasswordError('Mật khẩu không khớp');
    } else if (password.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);

  const handleSignUp = () => {
    if (passwordError) {
      return;
    }
    console.log('Đăng ký');
  };

  return (
    <StyledImageBackground
      source={require('../../assets/images/bg-heroBanner.png')}
      className="flex-1"
    >
      <StyledSafeAreaView className="flex-1 justify-top px-8">
        <StyledView className="items-center mt-5">
          <HodophileLogo width={328} height={96} />
        </StyledView>
        <StyledLinearGradient
          colors={['#24BAEC', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="rounded-3xl p-4"
        >
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            containerClassName="h-12"
            inputClassName="h-full"
          />
          <CustomInput
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            containerClassName="h-12"
            secureTextEntry
            inputClassName="h-full"
          />
          <CustomInput
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            containerClassName="h-12"
            secureTextEntry
            inputClassName="h-full"
          />
          {passwordError ? (
            <StyledText className="font-vollkorn-regular text-red text-sm mt-1 ml-8">{passwordError}</StyledText>
          ) : null}
          <CustomInput
            placeholder="Họ tên"
            value={fullName}
            onChangeText={setFullName}
            containerClassName="h-12"
            inputClassName="h-full"
          />
          <CustomInput
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            containerClassName="h-12"
            inputClassName="h-full"
          />
          <CustomInput
            placeholder="Địa chỉ"
            value={address}
            onChangeText={setAddress}
            containerClassName="h-12 mb-12"
            inputClassName="h-full"
          />
          <Button className="font-vollkorn-regular" title="Đăng ký" onPress={handleSignUp} />
          <StyledView className="flex-row justify-center mt-5 mb-12">
            <StyledText className="font-vollkorn-regular text-gray text-sm">Đã có tài khoản? </StyledText>
            <StyledTouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
              <StyledText className="font-vollkorn-regular text-blue text-sm">Đăng nhập</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledLinearGradient>
      </StyledSafeAreaView>
    </StyledImageBackground>
  )
}

export default SignUp