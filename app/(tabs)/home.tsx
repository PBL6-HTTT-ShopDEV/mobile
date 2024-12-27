import { 
  Animated, 
  FlatList, 
  SafeAreaView, 
  View, 
  Text, 
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Header from '../../components/Header'
import TourCard from '../../components/TourCard'
import { useTour } from '../../hooks/useTour'
import { ITour } from '../../types/Tour.types'
import { mockFeedback } from '../../data/mockFeedback'
import FeedbackCard from '../../components/FeedbackCard'
import { IFeedback } from '../../types/Feedback.type'
import SearchBar from '../../components/SearchBar'
const HEADER_MAX_HEIGHT = 256;
const HEADER_MIN_HEIGHT = 80;

const Home = () => {
  const { tours, loading, error, getTours, searchTours } = useTour();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getTours();
  }, []);

  const renderFeedbackCard = ({ item }: { item: IFeedback }) => (
    <FeedbackCard 
      key={item.statement}
      {...item} 
    />
  );

  const renderTourCard = ({ item }: { item: ITour }) => (
    <TourCard 
      key={item._id}
      {...item} 
    />
  );

  return (
    <SafeAreaView className='flex-1'>
      {loading ? (
        <ActivityIndicator 
          size="large" 
          color="#24ABEC" 
          style={{ position: 'absolute', top: '50%', left: '50%' }} 
        />
      ) : (
        <>
          <Header animatedValue={scrollY} />
          <SearchBar 
            initialValue=""
            onSearch={async (term) => {
              await searchTours(term);
            }}
          />
          <Animated.ScrollView
            className="flex-1 mt-12"
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            contentContainerStyle={{ 
              paddingTop: HEADER_MAX_HEIGHT, 
              paddingBottom: insets.bottom + 100 
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="mt-5 bg-white">
              <View className="px-16 mr-5 flex-row justify-between items-center">
                <Text className="text-2xl ml-6 font-vollkorn-bold">
                  Tour thịnh hành
                </Text>
                <TouchableOpacity 
                  onPress={() => router.push('/tours/all')}
                  className="bg-transparent"
                >
                  <Text className="text-blue font-vollkorn-medium ml-16">Xem tất cả</Text>
                </TouchableOpacity>
              </View>
              <View className="h-2 w-32 ml-28 items-center bg-blue rounded-full my-1" />
              <View className="ml-5">
              <FlatList
                data={tours}
                renderItem={renderTourCard}
                keyExtractor={(item) => item._id}
                horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>

            <View className="mt-5">
              <View className="h-full">
                <ImageBackground
                  source={require('../../assets/images/feedback-bg.png')}
                  resizeMode="stretch"
                  className="w-full h-full"
                >
                  <View className="h-auto justify-center py-4">
                    <View className="px-16 mr-5">
                      <Text className="text-2xl font-vollkorn-bold text-center">
                        Khách hàng nói gì về Hodophile
                      </Text>
                      
                      <View className="h-2 w-32 ml-14 bg-blue rounded-full" />
                    </View>
                    <FlatList
                      data={mockFeedback}
                      renderItem={renderFeedbackCard}
                      keyExtractor={(item) => item.statement}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                </ImageBackground>
              </View>
            </View>
          </Animated.ScrollView>
        </>
      )}
    </SafeAreaView>
  )
}

export default Home