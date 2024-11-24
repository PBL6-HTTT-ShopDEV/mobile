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
const Booking: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
  });
  const handlePayment = () => {
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address || !formData.email) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Tính tổng tiền
    const totalAmount = (adultCount * 1000000) + (childCount * 500000);

    // Gọi hàm thanh toán VNPay với các options
    handleVNPayPayment({
      amount: totalAmount,
   
    });
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
    <View className='bg-white'>
      <TouchableOpacity className='absolute top-8 left-2 z-10 pr-10' onPress={() => router.back()}>
        <Ionicons name="chevron-back-outline" size={30} color="black" /> 
      </TouchableOpacity>
      <View className='mt-9'>
        <Text className='text-3xl text-center font-vollkorn-bold text-blue'>Đặt tour</Text>
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
        <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
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
    <View className="px-6 mt-4">
          <TouchableOpacity 
            onPress={handlePayment}
            className="bg-blue py-4 rounded-lg"
          >
            <Text className="text-white text-center text-lg font-vollkorn-bold">
              Thanh toán qua VNPay
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default Booking