import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../../hooks/AuthContext';
import bookingService from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';
import { IBooking } from '../../types/Booking.types';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Schedule = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect nếu chưa đăng nhập
 
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Debug user data
      const userStr = await AsyncStorage.getItem('user');
      console.log('Current user data:', userStr);

      const response = await bookingService.getBookingsByUserId();
      console.log('Bookings response:', response);
      
      if (response.status === 'success' && response.data) {
        setBookings(response.data);
      } else {
        console.log('Failed to fetch bookings:', response.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []); // Chỉ fetch một lần khi mount vì đã có guard ở trên

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-2xl font-vollkorn-bold text-gray-800">
          Lịch trình của tôi
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-600 font-vollkorn-medium">
              Đang tải lịch trình...
            </Text>
          </View>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-lg font-vollkorn-medium text-gray-600 text-center">
              Bạn chưa có booking nào{'\n'}
              Hãy đặt tour để bắt đầu hành trình của bạn!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Schedule;