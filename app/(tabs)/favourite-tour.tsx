import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Text,ScrollView,View } from 'react-native'
import TourCard from '../../components/TourCard'
import {useFavoriteTour} from '../../hooks/FavouriteTourContext'
const FavouriteTour = () => {
  const { favoriteTours } = useFavoriteTour();

  return (
    <View className='bg-white'>
      <Text className='mt-6 text-center text-3xl font-vollkorn-bold text-blue bg-'>Tour yêu thích</Text>
    <ScrollView className="bg-default p-4 rounded-xl" contentContainerStyle={{ paddingBottom: 120 }}>
      {favoriteTours.length > 0 ? (
        favoriteTours.map(tour => <TourCard key={tour.tour_id} {...tour} />)
      ) : (
        <Text className="text-center text-gray">Không có tour yêu thích</Text>
      )}
    </ScrollView>
    </View>
)}

export default FavouriteTour