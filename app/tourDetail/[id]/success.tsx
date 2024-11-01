import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Success = () => {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white">
      <View className="mt-9">
        <Text className="text-3xl text-center font-vollkorn-bold text-blue">Đặt tour</Text>
        
        {/* Progress bar */}
        <View className="flex justify-center flex-nowrap items-center flex-row gap-1 mt-2">
          <View className="justify-center items-center">
            <FontAwesome5 name="user-edit" size={24} color="black" />
            <Text className="text-lg font-vollkorn-bold text-black-60">Nhập thông tin</Text>
          </View>
          <View className="-top-2">
            <FontAwesome name="arrow-right" size={24} color="black" />
          </View>
          <View className="justify-center items-center">
            <MaterialIcons name="payment" size={28} color="black" />
            <Text className="text-lg font-vollkorn-bold text-black-60">Thanh toán</Text>
          </View>
          <View className="-top-2">
            <FontAwesome name="arrow-right" size={24} color="black" />
          </View>
          <View className="justify-center items-center">
            <FontAwesome name="check-circle" size={28} color="#24ABEC" />
            <Text className="text-lg font-vollkorn-bold text-blue">Hoàn tất</Text>
          </View>
        </View>

        <View className="flex-1 justify-center items-center p-4 mt-8">
          <FontAwesome name="check-circle" size={80} color="#24ABEC" />
          <Text className="text-2xl text-center font-vollkorn-bold text-black mt-4">
            Đặt tour thành công!
          </Text>
          <View className="h-1.5 w-48 bg-blue rounded-full mx-auto my-4" />
          
          <TouchableOpacity 
            onPress={() => router.push("/(tabs)/home")}
            className="bg-blue py-4 px-8 rounded-lg w-full mt-8"
          >
            <Text className="text-white text-center text-lg font-vollkorn-bold">
              Về trang chủ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Success;