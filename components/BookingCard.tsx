import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { IBooking } from '../types/Booking.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BookingDetailModal from './BookingDetailModal';

interface BookingCardProps {
  booking: IBooking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const tour = typeof booking.tour === 'object' ? booking.tour : null;
  
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

  return (
    <>
      <TouchableOpacity 
        className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
        onPress={() => setModalVisible(true)}
      >
        {/* Card content - giữ nguyên như cũ */}
        {tour && tour.thumbnail_url && (
          <Image
            source={{ uri: tour.thumbnail_url }}
            className="w-full h-40"
            resizeMode="cover"
          />
        )}

        <View className="p-4">
          <Text className="text-xl font-vollkorn-bold text-gray-800 mb-2">
            {tour?.name || 'Tour không xác định'}
          </Text>

          <View className={`${getStatusColor(booking.status)} rounded-full px-3 py-1 self-start mb-2`}>
            <Text className="text-white text-sm font-vollkorn-medium">
              {booking.status === 'pending' ? 'Chờ xác nhận' : 
               booking.status === 'success' ? 'Đã xác nhận' : 'Đã huỷ'}
            </Text>
          </View>

          <View className="space-y-2">
            <View className="flex-row items-center">
              <FontAwesome name="users" size={16} color="#666" />
              <Text className="ml-2 text-gray-600">
                {booking.number_of_people} người
              </Text>
            </View>

            <View className="flex-row items-center">
              <FontAwesome name="money" size={16} color="#666" />
              <Text className="ml-2 text-gray-600">
                {booking.total_price.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>

            <View className="flex-row items-center">
              <FontAwesome name="calendar" size={16} color="#666" />
              <Text className="ml-2 text-gray-600">
                Ngày đặt: {formatDate(booking.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <BookingDetailModal
        booking={booking}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default BookingCard; 