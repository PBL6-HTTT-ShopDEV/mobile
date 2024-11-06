import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ITour } from '../../types/Tour.types';
import { getTours } from '../../models/tours';
import TourCard from '../../components/TourCard';
import SearchBar from '../../components/SearchBar';

const SearchPage = () => {
  const [tours, setTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(true);
  const { q } = useLocalSearchParams();
  const router = useRouter();
  console.log("Query Param q:", q);

  useEffect(() => {
    let isMounted = true;

    const searchTours = async () => {
      try {
        const response = await getTours('1', { destination: q as string }, '16');
        console.log('API response:', response);
        if (isMounted && response && response.data) {
          const filteredTours = response.data.filter((tour): tour is ITour => tour !== undefined);
          setTours(filteredTours);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    if (q) {
      searchTours();
    }

    return () => {
      isMounted = false;
    };
  }, [q]);

  const renderTourCard = ({ item, index }: { item: ITour; index: number }) => (
    <TourCard
      key={index.toString()}
      tour_id={item.tour_id}
      name={item.name}
      description={item.description}
      price={item.price}
      start_date={item.start_date}
      end_date={item.end_date}
      destination={item.destination}
      image_url={item.image_url}
      departure_location={item.departure_location}
      created_at={item.created_at}
    />
  );

  const handleSearch = (searchTerm: string) => {
    router.push({
      pathname: '/tours/search',
      params: { q: searchTerm }
    });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <SearchBar onSearch={handleSearch} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#24ABEC" style={{ position: 'absolute', top: '50%', left: '50%' }} />
      ) : (
        <FlatList
          data={tours}
          renderItem={renderTourCard}
          keyExtractor={(item) => item.tour_id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default SearchPage;