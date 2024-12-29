import { Button, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomInput from '../../../components/CustomInput';
import { handleVNPayPayment } from '../../../utilities/vnpayUtils';
import { Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { validateVNPayResponse } from '../../../utilities/vnpayUtils';
import { useAuth } from '../../../hooks/AuthContext';
import bookingService from '../../../services/bookingService';
import { tourService } from '../../../services/tourService';
import { ITour } from '../../../types/Tour.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Booking: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [tourData, setTourData] = useState<ITour | null>(null);

  // Debug useAuth
  useEffect(() => {
    const checkAuthState = async () => {
      console.log('Current user:', user);
      console.log('Is authenticated:', isAuthenticated);
      
      // Kiểm tra AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Stored user in AsyncStorage:', storedUser);
      console.log('Stored token in AsyncStorage:', token ? 'exists' : 'not found');

      if (!user && storedUser && token) {
        console.log('User data exists in storage but not in context, refreshing...');
        await refreshUserData();
      }
    };

    checkAuthState();
  }, [user, isAuthenticated]);

  // Fetch tour data khi component mount
  useEffect(() => {
    const fetchTourData = async () => {
      if (id) {
        const response = await tourService.getTourById(id as string);
        if (response.status === 'success' && response.data) {
          // Đảm bảo data có đầy đủ các trường bắt buộc
          const tour = response.data;
          if (
            tour._id &&
            tour.name &&
            typeof tour.price === 'number' &&
            tour.destination &&
            tour.departure_location &&
            tour.start_date &&
            tour.end_date
          ) {
            setTourData(tour as ITour); // Type assertion sau khi đã kiểm tra
          } else {
            Alert.alert('Lỗi', 'Dữ liệu tour không đầy đủ');
          }
        }
      }
    };
    fetchTourData();
  }, [id]);

  // Thêm các hàm validate
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Regex cho số điện thoại Việt Nam
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
  };

  const handlePayment = async () => {
    console.log('handlePayment called');
    console.log('Current user state:', user);
    console.log('Current auth state:', isAuthenticated);

    if (!user) {
      console.log('No user found, checking storage...');
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Stored user:', storedUser);
      console.log('Token exists:', !!token);

      if (storedUser && token) {
        console.log('Found stored user data, attempting refresh...');
        await refreshUserData();
        if (!user) {
          console.log('Still no user after refresh');
          Alert.alert('Thông báo', 'Vui lòng đăng nhập lại để đặt tour');
          return;
        }
      } else {
        Alert.alert('Thông báo', 'Vui lòng đăng nhập để đặt tour');
        return;
      }
    }

    if (!tourData) {
      console.log('No tour data found');
      Alert.alert('Thông báo', 'Không tìm thấy thông tin tour');
      return;
    }

    // Validate form
    console.log('Form data:', formData);
    if (!formData.fullName || !formData.phone || !formData.address || !formData.email) {
      console.log('Missing form fields:', {
        fullName: !formData.fullName,
        phone: !formData.phone,
        address: !formData.address,
        email: !formData.email
      });
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      Alert.alert('Thông báo', 'Email không hợp lệ');
      return;
    }

    // Validate phone
    if (!validatePhone(formData.phone)) {
      Alert.alert('Thông báo', 'Số điện thoại không hợp lệ');
      return;
    }

    // Kiểm tra số lượng người
    const totalPeople = adultCount + childCount;
    
    console.log('People check:', {
      totalPeople,
      maxSize: tourData?.max_group_size,
      isValid: totalPeople > 0 && totalPeople <= (tourData?.max_group_size || 0)
    });

    if (totalPeople <= 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số lượng người tham gia');
      return;
    }

    if (tourData && totalPeople > tourData.max_group_size) {
      Alert.alert(
        'Thông báo', 
        `Số lượng người vượt quá giới hạn cho phép (tối đa ${tourData.max_group_size} người)`
      );
      return;
    }

    setLoading(true);
    try {
      // Tạo booking
      const bookingData = {
        tour: id as string,
        number_of_people: adultCount + childCount,
        total_price: (adultCount * tourData.price) + (childCount * tourData.price * 0.5),
        status: 'pending' as const,
        user_info: formData
      };
      console.log('Creating booking with data:', bookingData);

      const bookingResponse = await bookingService.createBooking(bookingData);
      console.log('Booking response:', bookingResponse);

      if (bookingResponse.status === 'success' && bookingResponse.data) {
        console.log('Booking created successfully, proceeding to payment');
        
        // Lưu cả booking ID và user ID
        await AsyncStorage.setItem('current_booking_id', bookingResponse.data._id);
        await AsyncStorage.setItem('userId', user._id); // Lưu user ID
        
        handleVNPayPayment({
          amount: bookingData.total_price
        });
      } else {
        console.log('Booking creation failed:', bookingResponse.message);
        Alert.alert('Thông báo', bookingResponse.message || 'Không thể tạo booking');
      }
    } catch (error) {
      console.error('Error during booking creation:', error);
      Alert.alert(
        'Lỗi',
        error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi tạo booking'
      );
    } finally {
      setLoading(false);
    }
  };
  const renderAdults = () => {
    return Array.from({ length: adultCount }, (_, index) => (
      <View key={`adult-${index}`} className="mb-4">
        <Text className='text-xl font-vollkorn-bold'>Người lớn {index + 1}</Text>
        <Text className='text-lg font-vollkorn-bold'>Họ và tên<Text style={{ color: 'red' }}>*</Text> </Text>{/* Dấu hoa thị đỏ */}
        <CustomInput placeholder="Họ và tên" containerClassName="mt-0" />
        <Text className='text-lg font-vollkorn-bold'>Ngày sinh<Text style={{ color: 'red' }}>*</Text> </Text>{/* Dấu hoa thị đỏ */}
        <CustomInput placeholder="Mời nhập ngày sinh" containerClassName="mt-0" />
        <Text className='text-lg font-vollkorn-bold'>Số điện thoại<Text style={{ color: 'red' }}>*</Text> </Text>{/* Dấu hoa thị đỏ */}
        <CustomInput placeholder="Mời nhập địa chỉ" containerClassName="mt-0" />
      </View>
    ));
  };

  const renderChildren = () => {
    return Array.from({ length: childCount }, (_, index) => (
      <View key={`child-${index}`} className="">
        <Text className='text-xl font-vollkorn-bold'>Người lớn {index + 1}</Text>
        <Text className='text-lg font-vollkorn-bold'>Họ và tên<Text style={{ color: 'red' }}>*</Text> </Text>{/* Dấu hoa thị đỏ */}
        <CustomInput placeholder="Họ và tên" containerClassName="mt-0" />
        <Text className='text-lg font-vollkorn-bold'>Ngày sinh<Text style={{ color: 'red' }}>*</Text> </Text>{/* Dấu hoa thị đỏ */}
        <CustomInput placeholder="Mời nhập ngày sinh" containerClassName="mt-0" />
        <Text className='text-lg font-vollkorn-bold'>Số điện thoại<Text style={{ color: 'red' }}>*</Text> </Text>{/* Dấu hoa thị đỏ */}
        <CustomInput placeholder="Mời nhập địa chỉ" containerClassName="mt-0" />
      </View>
    ));
  };

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    // Lắng nghe sự kiện deep linking
    const handleDeepLink = (event: { url: string }) => {
      if (event.url.includes('payment-return')) {
        const params = Linking.parse(event.url).queryParams as Record<string, string>;
        const isValid = validateVNPayResponse(params);
        
        if (isValid) {
          if (params['vnp_ResponseCode'] === '00') {
            Alert.alert('Thành công', 'Thanh toán thành công');
            // Có thể thêm navigation hoặc update state ở đây
          } else {
            Alert.alert('Thất bại', `Thanh toán thất bại. Mã lỗi: ${params['vnp_ResponseCode']}`);
          }
        } else {
          Alert.alert('Lỗi', 'Dữ liệu không hợp lệ');
        }
      }
    };

    // Đăng ký listener
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Kiểm tra initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View className='flex-1 bg-white'>
      <TouchableOpacity className='absolute top-8 left-2 z-10 pr-10' onPress={() => router.back()}>
        <Ionicons name="chevron-back-outline" size={30} color="black" /> 
      </TouchableOpacity>

      {/* Header */}
      <View className='mt-9'>
        <Text className='text-3xl text-center font-vollkorn-bold text-blue'>Đặt tour</Text>
        {/* Progress steps */}
        <View className='flex justify-center flex-nowrap items-center flex-row gap-1 mt-2'>
          <View className='justify-center items-center'>
            <FontAwesome5 name="user-edit" size={24} color="#24ABEC" />
            <Text className='text-lg font-vollkorn-bold text-blue'>Nhập thông tin</Text>
          </View>
          <View className='-top-2'>
            <FontAwesome name="arrow-right" size={24} color="black" />
          </View>
          <View className='justify-center items-center'>
            <MaterialIcons name="payment" size={28} color="black" />
            <Text className='text-lg font-vollkorn-bold text-black-60'>Thanh toán</Text>
          </View>
          <View className='-top-2'>
            <FontAwesome name="arrow-right" size={24} color="black" />
          </View>
          <View className='justify-center items-center'>
            <FontAwesome name="check-circle" size={28} color="black" />
            <Text className='text-lg font-vollkorn-bold text-black-60'>Hoàn tất</Text>
          </View>
        </View>
      </View>

      {/* Main content */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className='text-2xl text-center font-vollkorn-bold text-black mt-5'>Thông tin liên lạc</Text>
        <View className="h-1.5 w-56 bg-blue rounded-full mx-auto" />
        <View className='ml-6'>
          <Text className='text-lg font-vollkorn-bold'>Họ và tên<Text style={{ color: 'red' }}>*</Text></Text>
          <CustomInput 
            containerClassName='mt-1 mb-2' 
            placeholder='Nhập họ và tên'
            value={formData.fullName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
          />
          
          <Text className='text-lg font-vollkorn-bold'>Số điện thoại<Text style={{ color: 'red' }}>*</Text></Text>
          <CustomInput 
            containerClassName='mt-1 mb-2' 
            placeholder='Nhập số điện thoại'
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
          />
          
          <Text className='text-lg font-vollkorn-bold'>Địa chỉ<Text style={{ color: 'red' }}>*</Text></Text>
          <CustomInput 
            containerClassName='mt-1 mb-2' 
            placeholder='Nhập địa chỉ'
            value={formData.address}
            onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
          />
          
          <Text className='text-lg font-vollkorn-bold'>Gmail<Text style={{ color: 'red' }}>*</Text></Text>
          <CustomInput 
            containerClassName='mt-1 mb-2' 
            placeholder='Nhập gmail'
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
          />
        </View>
        <Text className='text-2xl text-center font-vollkorn-bold text-black mt-5'>Số lượng hành khách</Text>
        <View className="h-1.5 w-64 bg-blue rounded-full mx-auto" />
        <View className="p-4">
        <View className="flex-row items-center mb-4">
          <View className="p-4">
      {/* Phần người lớn */}
      <View className=" flex-1 flex-row items-center mb-4">
        <Text className='text-xl'>Người lớn:</Text>
        <TouchableOpacity
          onPress={() => setAdultCount(Math.max(adultCount - 1, 0))}
          className="rounded-full px-5 mx-auto"
        >
          <FontAwesome name="minus" size={24} color="black" />
        </TouchableOpacity>
        <Text className="mx-2">{adultCount}</Text>
        <TouchableOpacity
          onPress={() => setAdultCount(adultCount + 1)}
          className="rounded-full px-5 mx-1"
        >
          <FontAwesome name="plus" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Phần trẻ em */}
      <View className="flex-1 flex-row items-center mb-4">
        <Text className='text-xl'>Trẻ em:</Text>
        <TouchableOpacity
          onPress={() => setChildCount(Math.max(childCount - 1, 0))}
          className="rounded-full px-5 mx-auto"
        >
          <FontAwesome name="minus" size={24} color="black" />
        </TouchableOpacity>
        <Text className="mx-2">{childCount}</Text>
        <TouchableOpacity
          onPress={() => setChildCount(childCount + 1)}
          className=" rounded-full px-5 mx-auto"
        >
         <FontAwesome name="plus" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
        </View>

      {/* Hiển thị thông tin cho người lớn */}
      {renderAdults()}
      
      {/* Hiển thị thông tin cho trẻ em */}
      {renderChildren()}
    </View>
      </ScrollView>

      {/* Fixed bottom button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-lg">
        <TouchableOpacity 
          onPress={handlePayment}
          className="bg-blue py-4 rounded-lg"
        >
          <Text className="text-white text-center text-lg font-vollkorn-bold">
            Thanh toán qua VNPay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Booking