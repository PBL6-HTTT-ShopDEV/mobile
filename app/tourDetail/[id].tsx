import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, ImageBackground, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header';
import { getTourById } from '../../models/tours';
import { ITour } from '../../types/Tour.types';
import { calculateDaysAndNights } from '../../utilities/calculateDay';
import Heart from '../../components/icons/heart';
import Button from '../../components/Button';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import ExpandablePanel from '../../components/ExpandablePanel';
const TourDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  const tourId = Array.isArray(id) ? id[0] : id;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tour, setTour] = useState<Partial<ITour | null>>(null);
  const [nights, setNights] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const handleBooking = () => {
    router.push({
      pathname: `/tourDetail/[id]/booking`,
      params: { id: tourId }
    });
  };
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (tourId) {
      const fetchTourDetails = async () => {
        try {
          const response = await getTourById(tourId);
          if (isMounted) {
            if (response.status === 'success' && response.data) {
              const data = response.data;
              setTour(data);
              console.log(data);
              if (data && data.start_date && data.end_date) {
                const { nights } = calculateDaysAndNights(data.start_date, data.end_date);
                setNights(nights);
              }
            }
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchTourDetails();

      return () => {
        isMounted = false;
      };
    }
  }, [id]);

  return (
    <View className='flex-1'>
      <TouchableOpacity className='absolute top-8 left-2 z-10 pr-10' onPress={() => router.back()}>
      <Ionicons name="chevron-back-outline" size={36} color="white" /> 
      </TouchableOpacity>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : !tour ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-bold">Không tìm thấy kết quả phù hợp</Text>
        </View>
      ) : (
        <View className="relative" style={{ height: '100%' }}>
          <ImageBackground style={{ width: '100%', height: 250 }} source={{ uri: 'http://www.dylanhotel.com.vn/uploads/image/images/Duong-len-dinh-nui-Ngu-Hanh-Son(1).jpg' }}>
            <TouchableOpacity className='absolute top-8 right-2 z-10' onPress={() => setIsFavorite(!isFavorite)}>
              <Heart className='mr-5' fill={isFavorite ? '#FF0000' : 'none'} stroke='#ffffff' />
            </TouchableOpacity>
          </ImageBackground>
          <ScrollView className="flex-1 -mt-12 bg-white rounded-tl-card rounded-tr-card" contentContainerStyle={{ paddingBottom: 80 }}>
              <View className="px-4 py-4 " >
                <Text className="text-2xl font-bold text-blue">{tour.destination}</Text>
                <Text className="text-lg">{tour.departure_location}</Text>
                <View className="flex-row items-center justify-between mt-4">
                  <View className="flex-row items-center">
                    <Text className="text-red font-bold text-lg">Giá: {tour.price}VNĐ</Text>
                    <Text className="text-sm ml-2">/người</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className=" text-sm">{nights} đêm</Text>
                  </View>
                </View>
                <View className='flex-1 items-center'>
                  <Text className="text-black font-vollkorn-bold text-2xl text-center mt-4">Lịch trình</Text>
                  <View className="h-1 w-32 bg-blue rounded-full items-center" />
                </View>
                <ExpandablePanel tittle={'Ngày 1: TP. Đà Nẵng - Sân bay Nội Bài - Sapa (ăn trưa, tối)'} 
                content={['Quý khách tập trung tại sân bay Đà Nẵng - ga đi trong nước. Hướng dẫn viên làm thủ tục cho đoàn đáp chuyến bay đi Hà Nội. Đến sân bay Nội Bài, xe và hướng dẫn viên Vietravel đón Quý khách khởi hành đi Sa Pa theo cung đường cao tốc hiện đại và dài nhất Việt Nam. Đến Sapa, Quý khách dùng cơm tối và nhận phòng nghỉ ngơi hoặc tự do dạo phố ngắm nhà thờ Đá Sapa, tự do thưởng thức đặc sản vùng cao như: thịt lợn cắp nách nướng, trứng nướng, rượu táo mèo, giao lưu với người dân tộc vùng cao. Nghỉ đêm tại Sapa.']}/>
                <ExpandablePanel tittle={'Ngày 2: Sapa - Lao Chải - Tả Van - Sapa (ăn sáng, trưa, tối)'}
                content={["Quý khách tập trung tại sân bay Đà Nẵng - ga đi trong nước. Hướng dẫn viên làm thủ tục cho đoàn đáp chuyến bay đi Hà Nội. Đến sân bay Nội Bài, xe và hướng dẫn viên Vietravel đón Quý khách khởi hành đi Sa Pa theo cung đường cao tốc hiện đại và dài nhất Việt Nam. Đến Sapa, Quý khách dùng cơm tối và nhận phòng nghỉ ngơi hoặc tự do dạo phố ngắm nhà thờ Đá Sapa, tự do thưởng thức đặc sản vùng cao như: thịt lợn cắp nách nướng, trứng nướng, rượu táo mèo, giao lưu với người dân tộc vùng cao. Nghỉ đêm tại Sapa."]}/>
                <ExpandablePanel tittle={'Ngày 3: Sapa - Hà Nội ( sáng, trưa, tối)'}
                content={["Quý khách tập trung tại sân bay Đà Nẵng - ga đi trong nước. Hướng dẫn viên làm thủ tục cho đoàn đáp chuyến bay đi Hà Nội. Đến sân bay Nội Bài, xe và hướng dẫn viên Vietravel đón Quý khách khởi hành đi Sa Pa theo cung đường cao tốc hiện đại và dài nhất Việt Nam. Đến Sapa, Quý khách dùng cơm tối và nhận phòng nghỉ ngơi hoặc tự do dạo phố ngắm nhà thờ Đá Sapa, tự do thưởng thức đặc sản vùng cao như: thịt lợn cắp nách nướng, trứng nướng, rượu táo mèo, giao lưu với người dân tộc vùng cao. Nghỉ đêm tại Sapa."]}/>
                <ExpandablePanel tittle={'Ngày 4: Hà Nội - Hạ Long ( sáng, trưa, tối)'}
                content={["Quý khách tập trung tại sân bay Đà Nẵng - ga đi trong nước. Hướng dẫn viên làm thủ tục cho đoàn đáp chuyến bay đi Hà Nội. Đến sân bay Nội Bài, xe và hướng dẫn viên Vietravel đón Quý khách khởi hành đi Sa Pa theo cung đường cao tốc hiện đại và dài nhất Việt Nam. Đến Sapa, Quý khách dùng cơm tối và nhận phòng nghỉ ngơi hoặc tự do dạo phố ngắm nhà thờ Đá Sapa, tự do thưởng thức đặc sản vùng cao như: thịt lợn cắp nách nướng, trứng nướng, rượu táo mèo, giao lưu với người dân tộc vùng cao. Nghỉ đêm tại Sapa."]}/>
                <ExpandablePanel tittle={'Ngày 5: Hạ Long - Sân bay Nội Bài - Sân bay Đà Nẵng ( sáng, trưa)'}
                content={["Quý khách tập trung tại sân bay Đà Nẵng - ga đi trong nước. Hướng dẫn viên làm thủ tục cho đoàn đáp chuyến bay đi Hà Nội. Đến sân bay Nội Bài, xe và hướng dẫn viên Vietravel đón Quý khách khởi hành đi Sa Pa theo cung đường cao tốc hiện đại và dài nhất Việt Nam. Đến Sapa, Quý khách dùng cơm tối và nhận phòng nghỉ ngơi hoặc tự do dạo phố ngắm nhà thờ Đá Sapa, tự do thưởng thức đặc sản vùng cao như: thịt lợn cắp nách nướng, trứng nướng, rượu táo mèo, giao lưu với người dân tộc vùng cao. Nghỉ đêm tại Sapa."]}/>
              </View>
          </ScrollView>
          <View className='absolute bottom-0 left-0 right-0 p-4'>
            <Button title='Đặt ngay' onPress={handleBooking} />
          </View>
        </View>
      )}
    </View>
  );
};

export default TourDetail;