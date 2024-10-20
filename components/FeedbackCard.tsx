import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { IFeedback } from '../types/Feedback.type'
import { FontAwesome5 } from '@expo/vector-icons';


const FeedbackCard: React.FC<IFeedback> = ({ avatar, message, statement }) => {
  return (
    <View className="bg-white rounded-lg p-4 mx-4 my-4 shadow-md w-80">
      <View className="items-start">
          <FontAwesome5 name="quote-left" size={24} color="#0EA5E9" />
      </View>
      <Image 
        source={avatar as ImageSourcePropType} 
        className="w-15 h-15 rounded-full ml-9 mb-3"
      />
      <View className="items-center">
        <Text className="text-sm font-vollkorn-regular leading-5 mb-2">{message}</Text>
        <Text className="text-xs font-vollkorn-bold text-gray-700">{statement}</Text>
      </View>
      <View className="items-end">
          <FontAwesome5 name="quote-right" size={24} color="#0EA5E9" />
      </View>
    </View>
  );
};

export default FeedbackCard;