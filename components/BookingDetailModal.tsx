import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { IBooking, BookingStatus } from '../types/Booking.types';
import { ITour } from '../types/Tour.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { tourService } from '../services/tourService';
import bookingService from '../services/bookingService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleVNPayPayment } from '../utilities/vnpayUtils';
import { PendingPayment, IPaymentParams } from '../types/Payment.types';
interface BookingDetailModalProps {
  booking: IBooking;
  visible: boolean;
  onClose: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, visible, onClose }) => {
  const router = useRouter();
  const [fullTourData, setFullTourData] = useState<ITour | null>(null);
  const tour = typeof booking.tour === 'object' ? booking.tour : null;
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);

  useEffect(() => {
    const fetchTourDetails = async () => {
      if (tour?._id) {
        console.log('Fetching full tour details for:', tour._id);
        const tourResponse = await tourService.getTourById(tour._id);
        if (tourResponse.status === 'success' && tourResponse.data) {
          console.log('Full tour data received:', tourResponse.data);
          if (tourResponse.data._id) {
            setFullTourData(tourResponse.data as ITour);
          }
        }
      }
    };

    if (visible) {
      fetchTourDetails();
    }
  }, [visible, tour?._id]);

  useEffect(() => {
    const checkPendingPayment = async () => {
      if (booking.status === 'pending') {
        const payment = await bookingService.getPendingPayment(booking._id);
        setPendingPayment(payment);
      }
    };

    checkPendingPayment();
  }, [booking._id, booking.status]);

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-gray';
      case 'success':
        return 'bg-green';
      case 'failed':
        return 'bg-red';
      default:
        return 'bg-gray';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'Chưa thanh toán';
      case 'success':
        return 'Đã thanh toán';
      case 'failed':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const handleViewTour = () => {
    if (!tour?._id) {
      console.warn('Tour ID is missing');
      return;
    }
    
    const tourId = tour._id.toString().match(/ObjectId\('(.+)'\)/)?.[1] || tour._id.toString();
    if (!tourId) {
      console.warn('Invalid tour ID');
      return;
    }

    console.log("Clean Tour ID:", tourId);
    onClose();
    
    router.push({
      pathname: '/tourDetail/[id]',
      params: { id: tourId }
    });
  };

  const handlePayment = async () => {
    try {
      if (pendingPayment?.paymentUrl) {
        router.push({
          pathname: "/(payment)/vnpay",
          params: { paymentUrl: pendingPayment.paymentUrl }
        });
      } else {
        await AsyncStorage.setItem('current_booking_id', booking._id);
        
        handleVNPayPayment({
          amount: booking.total_price,
          bookingId: booking._id
        } as IPaymentParams);
      }
      onClose();
    } catch (error) {
      console.error('Error handling payment:', error);
      Alert.alert('Lỗi', 'Không thể xử lý thanh toán. Vui lòng thử lại sau.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="absolute right-4 top-4 z-10">
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            >
              <Text className="text-gray-500 text-xl">&times;</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            {/* Ảnh tour */}
            {fullTourData?.thumbnail_url && (
              <Image
                source={{ uri: fullTourData.thumbnail_url }}
                className="w-full h-48 rounded-xl mb-4"
                resizeMode="cover"
              />
            )}

            {/* Tên tour */}
            <Text className="text-2xl font-vollkorn-bold text-gray-800 mb-2">
              {fullTourData?.name || tour?.name || 'Tour không xác định'}
            </Text>

            {/* Trạng thái đặt tour */}
            <View className={`${getStatusColor(booking.status)} rounded-full px-3 py-1 self-start mb-4`}>
              <Text className="text-white text-sm font-vollkorn-medium">
                {getStatusText(booking.status)}
              </Text>
            </View>

            {/* Thông tin chi tiết */}
            <View className="space-y-3">

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Điểm đến:</Text>
                <Text className="font-vollkorn-medium">{fullTourData?.destination || tour?.destination}</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Điểm khởi hành:</Text>
                <Text className="font-vollkorn-medium">{fullTourData?.departure_location}</Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Ngày bắt đầu:</Text>
                <Text className="font-vollkorn-medium">{formatDate(fullTourData?.start_date)}</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Ngày kết thúc:</Text>
                <Text className="font-vollkorn-medium">{formatDate(fullTourData?.end_date)}</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Số người:</Text>
                <Text className="font-vollkorn-medium">{booking.number_of_people} người</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Tổng tiền:</Text>
                <Text className="font-vollkorn-bold text-blue-600">
                  {booking.total_price.toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>

              {booking.user_info && (
                <View className="mt-4 space-y-2">
                  <Text className="text-lg font-vollkorn-bold">Thông tin người đặt</Text>
                  <Text className="text-gray-600">Họ tên: {booking.user_info.fullName}</Text>
                  <Text className="text-gray-600">SĐT: {booking.user_info.phone}</Text>
                  <Text className="text-gray-600">Email: {booking.user_info.email}</Text>
                  <Text className="text-gray-600">Địa chỉ: {booking.user_info.address}</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Buttons */}
          <View className="p-4 border-t border-gray-200">
            {booking.status === 'pending' ? (
              <TouchableOpacity
                className="bg-blue rounded-lg py-3 items-center"
                onPress={handlePayment}
              >
                <Text className="text-white font-vollkorn-medium text-lg">
                  {pendingPayment ? 'Tiếp tục thanh toán' : 'Thanh toán ngay'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-blue rounded-lg py-3 items-center"
                onPress={handleViewTour}
              >
                <Text className="text-white font-vollkorn-medium text-lg">
                  Xem chi tiết tour
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BookingDetailModal; 