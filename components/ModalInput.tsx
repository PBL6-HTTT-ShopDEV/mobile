import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CustomInputProps {
  label: string;
  placeholder: string;
  isRequired?: boolean;
  onEdit: () => void;
  initialValue?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  label, 
  placeholder, 
  isRequired = false, 
  onEdit,
  initialValue = '',
  onChangeText,
  editable = true,
  secureTextEntry = false
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChangeText = (text: string) => {
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
            className={`flex-1 py-2 font-vollkorn-regular text-lg ml-2 ${!editable ? 'text-gray-500' : ''}`}
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            editable={editable}
            secureTextEntry={secureTextEntry}
          />
          {editable && (
            <TouchableOpacity 
              className="p-2" 
              onPress={handleEdit}
            >
              <Feather name="edit-2" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomInput;