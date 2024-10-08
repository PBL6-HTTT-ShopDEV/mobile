import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styled } from 'nativewind';

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const Button: React.FC<ButtonProps> = ({ title, onPress, className }) => {
  return (
    <StyledTouchableOpacity 
      className={`${className} bg-blue py-3 px-6 mx-12 rounded-button items-center justify-center shadow-md`} 
      onPress={onPress}
    >
      <StyledText className="text-white font-vollkorn-bold text-base">
        {title}
      </StyledText>
    </StyledTouchableOpacity>
  );
};

export default Button;