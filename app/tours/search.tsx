import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTour } from '../../hooks/useTour';
import SearchBar from '../../components/SearchBar';
import TourCard from '../../components/TourCard';
import { FlatList } from 'react-native-gesture-handler';

export default function Search() {
  const { q } = useLocalSearchParams();
  const { tours, loading, error, searchTours } = useTour();

  useEffect(() => {
    if (q) {
      searchTours(q as string);
    }
  }, [q]);

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <SearchBar 
          initialValue={q as string}
          onSearch={(term) => searchTours(term)}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#24ABEC" />
      ) : error ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-center text-gray-500 font-vollkorn">{error}</Text>
        </View>
      ) : tours.length > 0 ? (
        <FlatList
          data={tours}
          renderItem={({ item }) => <TourCard {...item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-center text-gray-500 font-vollkorn">
            Không tìm thấy tour phù hợp
          </Text>
        </View>
      )}
    </View>
  );
}
