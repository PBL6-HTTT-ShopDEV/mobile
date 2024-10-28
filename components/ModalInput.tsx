import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CustomInput = ({ 
  label, 
  placeholder, 
  isRequired = false, 
  onEdit,
  initialValue = '',
  onChangeText
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChangeText = (text) => {
    setValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <View className="mb-5">
      <View className="flex-row items-center">
        <Text className="text-lg font-vollkorn-bold">
          {label} {isRequired && <Text className="text-red">*</Text>}
        </Text>
        <View className="flex-1 flex-row items-center">
          <TextInput
            className="flex-1 py-2 font-vollkorn-regular text-lg ml-2"
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            className="p-2" 
            onPress={handleEdit}
          >
            <Feather name="edit-2" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomInput;