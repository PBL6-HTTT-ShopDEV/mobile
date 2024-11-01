// app/tourDetail/[id]/payment.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useVNPay } from '../../../components/VNpayWrapper';

const Payment = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { startPayment } = useVNPay();

  const handlePayment = () => {
    const paymentInfo = {
      scheme: 'your-app-scheme',
      isSandbox: true,
      paymentUrl: "https://sandbox.vnpayqr.vn/qrcode/api/merchant/51DSH2Jd/checkout",
      tmn_code: "YOUR_TMN_CODE",
      returnschema: "your-app-scheme://vnpay-return",
      amount: 100000,
      orderInfo: `Thanh toan tour #${id}`,
      orderType: "tourism",
      bankCode: "VNPAY",
      locale: "vn",
    };

    startPayment(
      paymentInfo,
      (result) => {
        console.log('Payment successful:', result);
        router.push({
          pathname: "/tourDetail/[id]/success" as any,
          params: { id }
        });
      },
      (error) => {
        console.error('Payment failed:', error);
        Alert.alert(
          'Payment Failed',
          error.message || 'An error occurred during payment',
          [{ text: 'OK' }]
        );
      }
    );
  };

  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity 
        className="absolute top-8 left-2 z-10 pr-10" 
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back-outline" size={30} color="black" />
      </TouchableOpacity>

      <View className="mt-9">
        <Text className="text-3xl text-center font-vollkorn-bold text-blue">Đặt tour</Text>
        
        <View className="flex justify-center flex-nowrap items-center flex-row gap-1 mt-2">
          <View className="justify-center items-center">
            <FontAwesome5 name="user-edit" size={24} color="black" />
            <Text className="text-lg font-vollkorn-bold text-black-60">Nhập thông tin</Text>
          </View>
          <View className="-top-2">
            <FontAwesome name="arrow-right" size={24} color="black" />
          </View>
          <View className="justify-center items-center">
            <MaterialIcons name="payment" size={28} color="#24ABEC" />
            <Text className="text-lg font-vollkorn-bold text-blue">Thanh toán</Text>
          </View>
          <View className="-top-2">
            <FontAwesome name="arrow-right" size={24} color="black" />
          </View>
          <View className="justify-center items-center">
            <FontAwesome name="check-circle" size={28} color="black" />
            <Text className="text-lg font-vollkorn-bold text-black-60">Hoàn tất</Text>
          </View>
        </View>

        <View className="flex-1 justify-center items-center p-4 mt-8">
          <Text className="text-2xl text-center font-vollkorn-bold text-black mb-2">
            Thanh toán
          </Text>
          <View className="h-1.5 w-32 bg-blue rounded-full mx-auto mb-8" />
          
          <Text className="text-xl font-vollkorn-bold mb-6">
            Tổng tiền: 100,000 VND
          </Text>
          
          <TouchableOpacity 
            onPress={handlePayment}
            className="bg-blue py-4 px-8 rounded-lg w-full"
          >
            <Text className="text-white text-center text-lg font-vollkorn-bold">
              Thanh toán với VNPay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Payment;