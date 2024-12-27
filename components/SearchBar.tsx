import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  containerStyle?: string;
  placeholder?: string;
  initialValue?: string;
  onSearch?: (term: string) => void;
}

export default function SearchBar({ 
  containerStyle = '', 
  placeholder = 'Tìm kiếm tour...', 
  initialValue = '',
  onSearch 
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim() && onSearch) {
        onSearch(term.trim());
      }
    }, 500),
    [onSearch]
  );

  const handleChangeText = (text: string) => {
    setSearchTerm(text);
    debouncedSearch(text);
  };

  return (
    <View className={`flex-row items-center bg-white rounded-full px-4 py-2 ${containerStyle}`}>
      <TextInput
        className="flex-1 font-vollkorn text-base"
        placeholder={placeholder}
        value={searchTerm}
        onChangeText={handleChangeText}
      />
      <TouchableOpacity onPress={() => searchTerm.trim() && onSearch?.(searchTerm.trim())}>
        <Ionicons name="search" size={24} color="#24ABEC" />
      </TouchableOpacity>
    </View>
  );
}