import { Animated, FlatList, SafeAreaView, ScrollView, View, Text, ImageBackground,ActivityIndicator } from 'react-native'
import React, { useRef, useState,useEffect } from 'react'
import TourCard from '../../components/TourCard'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import { ITour } from '../../types/Tour.types'
import { mockTourData } from '../../data/mockTourData'
import { mockFeedback } from '../../data/mockFeedback'
import { IFeedback } from '../../types/Feedback.type'
import FeedbackCard from '../../components/FeedbackCard'
import { FontAwesome5 } from '@expo/vector-icons'
import { getTours } from '../../models/tours'

const HEADER_MAX_HEIGHT = 256; // Chiều cao tối đa của header
const HEADER_MIN_HEIGHT = 80; // Chiều cao tối thiểu của header
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Home = () => {
  const [popularTours, setPopularTours] = useState<ITour[]>([]);
  const [loading, setShowLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<IFeedback[]>(mockFeedback);
  const [feedbackVisible, setFeedbackVisible] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const getPopularTours = async () => {
      try {
        console.log("Fetching tours...");
        const response = await getTours();
        console.log("API response:", response);
        if (isMounted) {
          if (response && response.data) {
            const filteredTours = response.data.filter((tour): tour is ITour => tour !== undefined);
            setPopularTours(filteredTours);
          } else {
            console.error("No data found in response");
          }
        }
      } catch (error) {
        console.error("Error fetching tours:", error); // Thêm xử lý lỗi
      } finally {
        setShowLoading(false);
      }
    };
    getPopularTours();

    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (!loading) {
      setFeedbackVisible(true); // Sau khi tours đã render xong, hiển thị feedback
    }
  }, [loading]);

  const renderFeedback = ({ item, index }: { item: IFeedback; index: number }) => (
    <FeedbackCard
      key={index.toString()}
      avatar={item.avatar}
      message={item.message}
      statement={item.statement}
    />
  );

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

  const insets = useSafeAreaInsets()
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView className='flex-1'>
      {loading ? (
        <ActivityIndicator size="large" color="#24ABEC" style = {{position: 'absolute',top:'50%',left:'50%'}} />
      ) : (
        <>
          <Header animatedValue={scrollY} />
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
              <View className="px-16 mr-5">
                <Text className="text-2xl font-bold text-center">
                  Tour thịnh hành
                </Text>
                <View className="h-2 w-32 ml-14 bg-blue rounded-full" />
              </View>
              <View>
                <FlatList
                  data={popularTours}
                  renderItem={renderTourCard}
                  keyExtractor={(item) => item.tour_id.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
            {/* Phần hiển thị feedback sau khi tours đã tải */}
            {feedbackVisible && (
              <View className="mt-5">
                <View className="h-full">
                  <ImageBackground
                    source={require('../../assets/images/feedback-bg.png')}
                    resizeMode="stretch"
                    className="w-full h-full"
                  >
                    <View className="h-auto justify-center py-4">
                      <View className="px-16 mr-5">
                        <Text className="text-2xl font-bold text-center">
                          Khách hàng nói gì về Hodophile
                        </Text>
                        <View className="h-2 w-32 ml-14 bg-blue rounded-full" />
                      </View>
                      <View className='flex-1 justify-center h-auto'>
                        <View>
                          <FlatList
                            data={feedback}
                            renderItem={renderFeedback}
                            keyExtractor={(item) => item.statement}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                            className='flex-1 h-auto'
                          />
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </View>
            )}
          </Animated.ScrollView>
        </>
      )}
    </SafeAreaView>
  )
}

export default Home