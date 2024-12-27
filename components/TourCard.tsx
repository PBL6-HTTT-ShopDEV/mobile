import React from 'react';
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

const TourCard: React.FC<ITour> = (props) => {
  const { 
    _id, 
    name,
    thumbnail_url,
    images,
    destination, 
    departure_location, 
    start_date, 
    end_date, 
    price 
  } = props;

  const { favoriteTours, toggleFavoriteTour } = useFavoriteTour();
  const isFavorite = favoriteTours.some(tour => tour._id === _id);

  const handleViewDetails = () => {
    if (!_id) {
      console.warn('Tour ID is missing');
      return;
    }
    
    const tourId = _id.toString().match(/ObjectId\('(.+)'\)/)?.[1] || _id.toString();
    if (!tourId) {
      console.warn('Invalid tour ID');
      return;
    }

    console.log("Clean Tour ID:", tourId);
    
    router.push({
      pathname: '/tourDetail/[id]',
      params: { id: tourId }
    });
  };

  const imageUrl = thumbnail_url || images?.[0];

  return (
    <StyledView className="bg-white rounded-xl shadow-sm mb-4 mx-2">
      <StyledView className="relative">
        <StyledImage
          source={{ 
            uri: thumbnail_url || 'https://placeholder-image.jpg'
          }}
          className="w-full h-48 rounded-t-lg"
          resizeMode="cover"
        />
        <StyledTouchableOpacity
          className="absolute top-2 right-2"
          onPress={() => toggleFavoriteTour(props)}
        >
          <Heart fill={isFavorite ? '#FF0000' : 'none'} stroke="#ffffff" />
        </StyledTouchableOpacity>
      </StyledView>

      <StyledView className="p-4">
        <StyledText className="text-lg font-bold mb-2">{name}</StyledText>
        <StyledView className="flex-row items-center mt-2">
          <Location className="w-10 h-10 mr-1" />
          <StyledText className="text-sm">
            Điểm đến: <StyledText className="font-bold">{destination}</StyledText>
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-center mt-2">
          <Ticket className="w-10 h-10 mr-1" />
          <StyledText className="text-sm">
            Điểm khởi hành: <StyledText className="font-bold">{departure_location}</StyledText>
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-center mt-2">
          <Calendar className="w-10 h-10 mr-1" />
          <StyledText className="text-sm">
            Ngày khởi hành: <StyledText className="font-bold">
              {new Date(start_date).toLocaleDateString('vi-VN')}
            </StyledText>
          </StyledText>
        </StyledView>
        <StyledView className="flex-row justify-between items-center mt-4">
          <StyledText className="text-sm font-vollkorn-bold text-red">
            Giá: <StyledText className="font-vollkorn-bold text-red">
              {price.toLocaleString('vi-VN')}
            </StyledText> vnđ
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