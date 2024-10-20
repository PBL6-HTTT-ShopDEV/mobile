import React from 'react';
import { Animated, ImageBackground } from 'react-native';
import SearchBar from './SearchBar';

interface HeaderProps {
  animatedValue: Animated.Value;
}

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 96;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Header: React.FC<HeaderProps> = ({ animatedValue }) => {
  const searchBarMarginTop = animatedValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT - 200, HEADER_MIN_HEIGHT / 2 - 51],
    extrapolate: 'clamp',
  });
  const headerHeight = animatedValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const titleOpacity = animatedValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const titleTranslate = animatedValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50, -150],
    extrapolate: 'clamp',
  });

  const subtitleOpacity = animatedValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 2, 4*HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const subtitleTranslate = animatedValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50, -150],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 z-10 bg-blue"
      style={{
        height: headerHeight,
      }}
    >
      <ImageBackground
        source={require('../assets/images/bg-heroBanner.png')}
        className="flex-1 "
      >
        <Animated.View
          className="flex-1 justify-start mt-8 mb-8 px-4 pb-4"
        >
          <Animated.Text
            className="mt-2 text-white font-vollkorn-bold text-2xl text-center"
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslate }],
            }}
          >
            Thèm đi lắm rồi, mình lên đường thôi!
          </Animated.Text>
          <Animated.View
            className="absolute top-0 left-0 right-0 px-4"
            style={{
              marginTop: searchBarMarginTop,
            }}
          >
            <SearchBar
              containerStyle="py-2 mt-4"
              placeholder="Bạn muốn đi đâu?"
            />
          </Animated.View>
          <Animated.Text
            className="text-white font-vollkorn-italic text-sm mt-2"
            style={{
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslate }],
            }}
          >
            Bạn chỉ việc đặt tour, còn lại để Hodophile lo!
          </Animated.Text>
        </Animated.View>
      </ImageBackground>
    </Animated.View>
  );
};

export default Header;