import React from 'react';
import { View, Text, Image } from 'react-native';
import { styled } from 'nativewind';
import { ITourCard } from '../types/Tour.types';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Heart from './icons/heart';
import Ticket from './icons/ticket';
import Location from './icons/location';
import Calendar from './icons/calendar';
import Button from './Button';
import Clock from './icons/clock';
  const StyledView = styled(View);
  const StyledText = styled(Text);
  const StyledImage = styled(Image);
  const StyledTouchableOpacity = styled(TouchableOpacity);
  const TourCard: React.FC<ITourCard> = ({
    tour_id,
    image_url,
    destination,
    departure_location,
    start_date,
    end_date,
    price
  }) => {
    const isValidImageUrl = false;
  
    const handleViewDetails = () => {
    //   router.push({
    //     pathname: '/tourDetail/[id]',
    //     params: { id: tour_id }
    //   });
    };
  
    return (
      <StyledView key={tour_id} className="bg-white rounded-lg p-4 m-2 relative">
          <StyledView className="absolute top-4 right-4 z-10">
            <Heart className=" w-11 h-11" />
          </StyledView>
      
        <StyledImage
          source={isValidImageUrl ? { uri: image_url } : require('../assets/images/default-image.jpg')}
          className="w-full h-40 rounded-t-lg"
        />
        <StyledView className="mt-2">
          <StyledText className="text-blue font-vollkorn-bold text-lg">{destination}</StyledText>
          <StyledView className="flex-row justify-between mt-2">
            <StyledView className="flex-row items-center">
              <Ticket className="w-9 h-9 mr-1 ml-1" />
              <StyledText className="text-sm text-gray">
                Mã tour: <StyledText className="font-vollkorn">{tour_id}</StyledText>
              </StyledText>
            </StyledView>
            <StyledView className="flex-row items-center">
              <Clock className="w-9 h-9 mr-1 mb-2" />
              <StyledText className="text-sm text-gray">
                Thời gian: {start_date}N{end_date}Đ
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="flex-row items-center mt-2">
            <Location className="w-9 h-9 mr-1 ml-1" />
            <StyledText className="text-sm">
              Điểm khởi hành: <StyledText className="font-bold">{departure_location}</StyledText>
            </StyledText>
          </StyledView>
          <StyledView className="flex-row items-center mt-2">
            <Calendar className="w-10 h-10 mr-1" />
            <StyledText className="text-sm">
              Ngày khởi hành: <StyledText className="font-bold">{start_date}</StyledText>
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between items-center mt-4">
            <StyledText className="text-sm">
              Giá: <StyledText className="font-bold text-red-500">{price}</StyledText> vnđ
            </StyledText>
            <StyledTouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded-md"
              onPress={handleViewDetails}
            >
              <StyledText className="text-white font-bold">Xem chi tiết</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
    );
  };
  
  export default TourCard;