import { View, Text, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native'
import Button from '../../components/Button';
import React, { useEffect, useState } from 'react'
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import HodophileLogo from '../../components/HodophileLogo';
import CustomInput from '../../components/CustomInput';
import { router } from 'expo-router';
import { authService } from '../../services/authService';
import { Alert } from 'react-native';
import { format, parse, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

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
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    if (password !== confirmPassword) {
      setPasswordError('Mật khẩu không khớp');
    } else if (password.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);

  const formatDateString = (dateString: string) => {
    if (!dateString) return '';
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      if (!isValid(parsedDate)) return '';
      
      return format(parsedDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const validateDateOfBirth = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      if (!isValid(parsedDate)) {
        return 'Ngày sinh không hợp lệ (DD/MM/YYYY)';
      }

      const today = new Date();
      let age = today.getFullYear() - parsedDate.getFullYear();
      
      const birthMonth = parsedDate.getMonth();
      const currentMonth = today.getMonth();
      
      if (currentMonth < birthMonth || 
          (currentMonth === birthMonth && today.getDate() < parsedDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        return 'Bạn phải đủ 18 tuổi trở lên';
      }
      if (age > 100) {
        return 'Ngày sinh không hợp lệ';
      }
      
      return '';
    } catch (error) {
      return 'Ngày sinh không hợp lệ (DD/MM/YYYY)';
    }
  };

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }

    if (passwordError) {
      Alert.alert('Lỗi', passwordError);
      return false;
    }

    if (dateOfBirth) {
      const dateError = validateDateOfBirth(dateOfBirth);
      if (dateError) {
        Alert.alert('Lỗi', dateError);
        return false;
      }
    }

    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    try {
      if (!validateForm()) return;
      
      console.log('Bắt đầu đăng ký với thông tin:', {
        name: fullName,
        email,
        password
      });

      // Bước 1: Đăng ký tài khoản
      const signupResponse = await authService.signup({
        name: fullName,
        email,
        password
      });

      console.log('Kết quả đăng ký:', signupResponse);
      
      // Sửa cách truy cập ID người dùng theo cấu trúc response mới
      const userId = signupResponse.metadata?.metadata?.account?._id;
      console.log('User ID:', userId);

      // Bước 2: Cập nhật thông tin profile
      if (userId) {
        const updateData = {
          name: fullName,
          phone_number: phoneNumber,
          address,
          date_of_birth: dateOfBirth ? formatDateString(dateOfBirth) : undefined
        };
        
        console.log('Cập nhật profile với dữ liệu:', updateData);
        
        try {
          const updateResponse = await authService.updateProfile(
            userId, 
            updateData
          );
          console.log('Kết quả cập nhật profile:', updateResponse);
        } catch (updateError) {
          console.error('Lỗi cập nhật profile:', updateError);
          Alert.alert(
            'Cảnh báo', 
            'Tài khoản đã được tạo nhưng chưa cập nhật được thông tin chi tiết'
          );
          router.replace('/(auth)/sign-in');
          return;
        }
      } else {
        console.error('Không tìm thấy ID người dùng trong response:', signupResponse);
        throw new Error('Không thể lấy thông tin người dùng sau khi đăng ký');
      }

      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)/sign-in')
        }
      ]);
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      Alert.alert('Lỗi', error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
    }
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
          <CustomInput
            placeholder="Ngày sinh (DD/MM/YYYY)"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            containerClassName="h-12"
            inputClassName="h-full"
          />
          <Button className="font-vollkorn-regular" title="Đăng ký" onPress={handleSignUp} />
          <StyledView className="flex-row justify-center mt-5 mb-12">
            <StyledText className="font-vollkorn-regular text-gray text-sm">Đã có tài khoản? </StyledText>
            <StyledTouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
              <StyledText className="font-vollkorn-regular text-blue text-sm">Đăng nhập</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledLinearGradient>
      </StyledSafeAreaView>
    </StyledImageBackground>
  )
}

export default SignUp