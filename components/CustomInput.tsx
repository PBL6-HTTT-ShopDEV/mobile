import React from 'react';
import { TextInput, View, TextInputProps } from 'react-native';
import { styled } from 'nativewind';

interface CustomInputProps extends TextInputProps {
  containerClassName?: string;
  inputClassName?: string;
}

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);

const CustomInput: React.FC<CustomInputProps> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  containerClassName, 
  inputClassName,
  ...rest 
}) => {
  return (
    <StyledView className={`bg-white rounded-text-input px-5 py-3 mb-4 mx-4 mt-4 ${containerClassName}`}
    style={{
      width: '90%',
      maxHeight: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <StyledTextInput
        className={`font-vollkorn-regular text-base text-gray placeholder-gray h-full ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
    </StyledView>
  );
};

export default CustomInput;