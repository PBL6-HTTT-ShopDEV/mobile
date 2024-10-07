import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Icon from 'react-native-vector-icons/FontAwesome';

const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface SocialLoginButtonsProps {
  onFacebookLogin: () => void;
  onGoogleLogin: () => void;
  onTwitterLogin: () => void;
  className?: string;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onFacebookLogin,
  onGoogleLogin,
  onTwitterLogin,
  className
}) => {
  return (
    <StyledView className={`flex-row justify-center items-center mt-5 ${className}`}>
      <StyledTouchableOpacity 
        className="w-12 h-12 rounded-full bg-white justify-center items-center mx-2.5 shadow-md"
        onPress={onFacebookLogin}
      >
        <Icon name="facebook" size={24} color="#3b5998" />
      </StyledTouchableOpacity>
      <StyledTouchableOpacity 
        className="w-12 h-12 rounded-full bg-white justify-center items-center mx-2.5 shadow-md"
        onPress={onGoogleLogin}
      >
        <Icon name="google" size={24} color="#db4437" />
      </StyledTouchableOpacity>
      <StyledTouchableOpacity 
        className="w-12 h-12 rounded-full bg-white justify-center items-center mx-2.5 shadow-md"
        onPress={onTwitterLogin}
      >
        <Icon name="twitter" size={24} color="#1da1f2" />
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default SocialLoginButtons;