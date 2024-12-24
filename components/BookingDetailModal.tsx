import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { IBooking } from '../types/Booking.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface BookingDetailModalProps {
  booking: IBooking;
  visible: boolean;
  onClose: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, visible, onClose }) => {
  const tour = typeof booking.tour === 'object' ? booking.tour : null;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
          {/* Header với nút đóng */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-vollkorn-bold">Chi tiết đặt tour</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            {/* Ảnh tour */}
            {tour?.thumbnail_url && (
              <Image
                source={{ uri: tour.thumbnail_url }}
                className="w-full h-48 rounded-xl mb-4"
                resizeMode="cover"
              />
            )}

            {/* Tên tour */}
            <Text className="text-2xl font-vollkorn-bold text-gray-800 mb-2">
              {tour?.name || 'Tour không xác định'}
            </Text>

            {/* Trạng thái */}
            <View className={`${getStatusColor(booking.status)} rounded-full px-3 py-1 self-start mb-4`}>
              <Text className="text-white text-sm font-vollkorn-medium">
                {booking.status === 'pending' ? 'Chờ xác nhận' : 
                 booking.status === 'success' ? 'Đã xác nhận' : 'Đã huỷ'}
              </Text>
            </View>

            {/* Thông tin chi tiết */}
            <View className="space-y-4">
              {/* Thông tin đặt tour */}
              <View className="bg-gray-50 p-4 rounded-xl">
                <Text className="text-lg font-vollkorn-bold mb-2">Thông tin đặt tour</Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Số người:</Text>
                    <Text className="font-vollkorn-medium">{booking.number_of_people} người</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Tổng tiền:</Text>
                    <Text className="font-vollkorn-medium">{booking.total_price.toLocaleString('vi-VN')} VNĐ</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Ngày đặt:</Text>
                    <Text className="font-vollkorn-medium">
                      {formatDate(booking.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Thông tin liên hệ */}
              <View className="bg-gray-50 p-4 rounded-xl">
                <Text className="text-lg font-vollkorn-bold mb-2">Thông tin liên hệ</Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Họ tên:</Text>
                    <Text className="font-vollkorn-medium">{booking.user_info?.fullName}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Số điện thoại:</Text>
                    <Text className="font-vollkorn-medium">{booking.user_info?.phone}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Email:</Text>
                    <Text className="font-vollkorn-medium">{booking.user_info?.email}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Địa chỉ:</Text>
                    <Text className="font-vollkorn-medium">{booking.user_info?.address}</Text>
                  </View>
                </View>
              </View>

              {/* Thông tin tour */}
              {tour && (
                <View className="bg-gray-50 p-4 rounded-xl">
                  <Text className="text-lg font-vollkorn-bold mb-2">Thông tin tour</Text>
                  <View className="space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Điểm đến:</Text>
                      <Text className="font-vollkorn-medium">{tour.destination}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Điểm khởi hành:</Text>
                      <Text className="font-vollkorn-medium">{tour.departure_location}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Ngày bắt đầu:</Text>
                      <Text className="font-vollkorn-medium">
                        {formatDate(tour.start_date)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Ngày kết thúc:</Text>
                      <Text className="font-vollkorn-medium">
                        {formatDate(tour.end_date)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default BookingDetailModal; 