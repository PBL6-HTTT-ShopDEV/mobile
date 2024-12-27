import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useTour } from '../../hooks/useTour';
import TourCard from '../../components/TourCard';
import SearchBar from '../../components/SearchBar';
import FilterModal from '../../components/FilterModal';
import { ITourFilters } from '../../types/Tour.types';

const AllToursScreen = () => {
  const { tours, loading, error, getAllTours, resetTours, searchTours } = useTour();
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<ITourFilters>({
    destination: '',
    price: '',
    start_date: ''
  });

  useEffect(() => {
    getAllTours(filters);
    return () => resetTours();
  }, [filters]); // Re-fetch khi filters thay đổi

  const handleApplyFilters = (newFilters: ITourFilters) => {
    setFilters(newFilters);
    // getAllTours sẽ tự động được gọi do dependency trong useEffect
  };

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <SearchBar 
          initialValue=""
          onSearch={async (term) => {
            await searchTours(term);
          }}
        />
        <TouchableOpacity 
          className="mt-2 p-2 bg-blue rounded-md"
          onPress={() => setShowFilter(true)}
        >
          <Text className="text-white text-center font-vollkorn">Bộ lọc</Text>
        </TouchableOpacity>
      </View>

      <FilterModal
        visible={showFilter}
        filters={filters}
        onClose={() => setShowFilter(false)}
        onApplyFilters={handleApplyFilters}
      />

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
};

export default AllToursScreen; 