import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  containerStyle?: string;
  placeholder?: string;
  // Thêm các props khác nếu cần
}

const SearchBar: React.FC<SearchBarProps> = ({ containerStyle = '', placeholder = 'Tìm kiếm...', ...props }) => {
  return (
    <View className={`flex-row items-center bg-white rounded-full px-4 mt-1 ${containerStyle}`}>
      <Ionicons name="search-outline" size={20} color="#888" />
      <TextInput
        className="flex-1 text-base"
        placeholder={placeholder}
        placeholderTextColor="#888"
        {...props}
      />
    </View>
  );
};

export default SearchBar;