import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { ITour } from '../types/Tour.types';
import { router } from 'expo-router';
import Heart from './icons/heart';
import Ticket from './icons/ticket';
import Location from './icons/location';
import Calendar from './icons/calendar';
import Button from './Button';
import Clock from './icons/clock';
import { useFavoriteTour } from '../hooks/FavouriteTourContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

const TourCard: React.FC<ITour> = (
  props
) => {
  const { tour_id, image_url, destination, departure_location, start_date, end_date, price } = props;
  const isValidImageUrl = true;
  const { favoriteTours, toggleFavoriteTour } = useFavoriteTour();
  const isFavorite = favoriteTours.some(tour => tour.tour_id === tour_id);

  const handleViewDetails = () => {
    router.push({
      pathname: '/tourDetail/[id]',
      params: { id: tour_id }
    });
  };

  return (
    <StyledView key={tour_id} className="bg-white rounded-lg p-4 m-5 shadow-md overflow-hidden shadow-lg shadow-gray" style={{ elevation: 5 }}>
      <StyledTouchableOpacity 
        className="absolute top-4 right-4 z-10"
        onPress={() => toggleFavoriteTour(props)}
      >
        <Heart className={`w-11 h-11 m-1`} fill={isFavorite ? '#FF0000' : 'none'} stroke='#ffffff'/>
      </StyledTouchableOpacity>
    
      <StyledImage
        source={isValidImageUrl ? { uri: image_url } : require('../assets/images/default-image.jpg')}
        className="w-full h-40 rounded-t-lg"
      />
      <StyledView className="mt-2">
        <StyledText className="text-blue font-vollkorn-bold text-lg">{destination}</StyledText>
        <StyledView className="flex-row justify-between mt-2">
          <StyledView className="flex-row items-center">
            <Ticket className="w-9 h-9 mr-1 ml-1" />
            <StyledText className="text-sm ">
              Mã tour: <StyledText className="font-vollkorn">{tour_id}</StyledText>
            </StyledText>
          </StyledView>
          <StyledView className="flex-row items-center">
            <Clock className="w-9 h-9 mr-1 mb-2" />
            <StyledText className="text-sm ">
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
          <StyledText className="text-sm font-vollkorn-bold text-red">
            Giá: <StyledText className="font-vollkorn-bold text-red">{price}</StyledText> vnđ
          </StyledText>
          <StyledTouchableOpacity
            className="bg-blue px-4 py-2 rounded-md"
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