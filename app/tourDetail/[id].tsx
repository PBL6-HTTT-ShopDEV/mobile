import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { tourService } from '../../services/tourService';
import { ITour } from '../../types/Tour.types';
import { calculateDaysAndNights } from '../../utilities/calculateDay';
import Heart from '../../components/icons/heart';
import Button from '../../components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import ExpandablePanel from '../../components/ExpandablePanel';

const TourDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tour, setTour] = useState<Partial<ITour | null>>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBooking = () => {
    if (!tour?._id) return;
    router.push({
      pathname: `/tourDetail/[id]/booking`,
      params: { id: tour._id.toString() }
    });
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchTourDetails = async () => {
      try {
        if (!id) {
          setError('ID tour không hợp lệ');
          return;
        }

        const tourId = Array.isArray(id) ? id[0] : id;
        const response = await tourService.getTourById(tourId);

        if (!isMounted) return;

        if (response.status === 'success' && response.data) {
          setTour(response.data);
          setError(null);
        } else {
          setError(response.message || 'Không thể tải thông tin tour');
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTourDetails();
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#24ABEC" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center text-red-500">{error}</Text>
      </View>
    );
  }

  if (!tour) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">Không tìm thấy tour</Text>
      </View>
    );
  }

  const { nights } = calculateDaysAndNights(
    new Date(tour.start_date || ''), 
    new Date(tour.end_date || '')
  );

  return (
    <View className='flex-1'>
      <TouchableOpacity 
        className='absolute top-8 left-2 z-10 pr-10' 
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back-outline" size={36} color="white" />
      </TouchableOpacity>

      <View className="relative" style={{ height: '100%' }}>
        <ImageBackground 
          style={{ width: '100%', height: 250 }} 
          source={{ uri: tour.thumbnail_url || tour.images?.[0] || '' }}
        >
          <TouchableOpacity 
            className='absolute top-8 right-2 z-10' 
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart className='mr-5' fill={isFavorite ? '#FF0000' : 'none'} stroke='#ffffff' />
          </TouchableOpacity>
        </ImageBackground>

        <ScrollView 
          className="flex-1 -mt-12 bg-white rounded-tl-card rounded-tr-card" 
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View className="px-4 py-4">
            <Text className="text-2xl font-bold text-blue">{tour.name}</Text>
            <Text className="text-lg">{tour.departure_location}</Text>

            <View className="flex-row items-center justify-between mt-4">
              <View className="flex-row items-center">
                <Text className="text-red font-bold text-lg">
                  {tour.price?.toLocaleString('vi-VN')} VNĐ
                </Text>
                <Text className="text-sm ml-2">/người</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-sm">{nights} đêm</Text>
              </View>
            </View>

            <View className='flex-1 items-center'>
              <Text className="text-black font-vollkorn-bold text-2xl text-center mt-4">
                Lịch trình
              </Text>
              <View className="h-1 w-32 bg-blue rounded-full items-center" />
            </View>

            {tour.schedule && tour.schedule.map((day, index) => (
              <ExpandablePanel
                key={index}
                tittle={`Ngày ${index + 1}: ${day.title}`}
                content={[day.description]}
              />
            ))}
          </View>
        </ScrollView>

        <View className='absolute bottom-0 left-0 right-0 p-4 bg-white'>
          <Button title='Đặt ngay' onPress={handleBooking} />
        </View>
      </View>
    </View>
  );
};

export default TourDetail;