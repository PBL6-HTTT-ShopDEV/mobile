import { Button, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomInput from '../../../components/CustomInput';

const Booking: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

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
          <Text className='text-lg font-vollkorn-bold'>Họ và tên<Text style={{ color: 'red' }}>*</Text> {/* Dấu hoa thị đỏ */}
          </Text>
          <CustomInput containerClassName= 'mt-1 mb-2' placeholder='Nhập họ và tên' />
          <Text className='text-lg font-vollkorn-bold'>Số điện thoại<Text style={{ color: 'red' }}>*</Text></Text>
          <CustomInput containerClassName= 'mt-1 mb-2' placeholder='Nhập số điện thoại' />    
          <Text className='text-lg font-vollkorn-bold'>Địa chỉ<Text style={{ color: 'red' }}>*</Text></Text>
          <CustomInput containerClassName= 'mt-1 mb-2' placeholder='Nhập địa chỉ' />
          <Text className='text-lg font-vollkorn-bold'>Gmail<Text style={{ color: 'red' }}>*</Text></Text>
          <CustomInput containerClassName= 'mt-1 mb-2' placeholder='Nhập gmail' />    
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
      </View>
    </View>
  )
}

export default Booking