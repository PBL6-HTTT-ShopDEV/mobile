import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

interface SearchBarProps {
  containerStyle?: string;
  placeholder?: string;
  onSearch?: (term: string) => void;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ containerStyle = '', placeholder = 'Tìm kiếm...',onSearch,
  initialValue = '',}) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        router.push({
          pathname: '/tours/search',
          params: { q: searchTerm.trim() }
        });
      }
    }
  };
  return (
    <View className={`flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm ${containerStyle}`}>
      <TextInput
        className="flex-1 text-base text-gray-900 mr-2"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Ionicons name="search" size={24} color="#4B5563" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;