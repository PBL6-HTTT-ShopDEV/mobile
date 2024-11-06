import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { styled } from 'nativewind';
import Button from './Button';
import HodophileLogo from './HodophileLogo';
import CustomInput from './CustomInput';
import SocialLoginButtons from './SocialLoginButtons';
import { Link } from 'expo-router';
import TourCard from './TourCard';
import FeedbackCard from './FeedbackCard';
import ExpandablePanel from './ExpandablePanel';
import ModalInput from './ModalInput';

// Import các component khác ở đây
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);


const components = {
  Button,
  HodophileLogo,
  CustomInput,
  SocialLoginButtons,
  TourCard,
  FeedbackCard,
  ExpandablePanel,
  ModalInput
};

const Playground = () => {
  const [currentComponent, setCurrentComponent] = useState('Button');
  const Component = components[currentComponent];

  return (
    <StyledScrollView className="flex-1 bg-gray">
      <StyledView className="p-4">
        <StyledText className="text-2xl font-bold mb-4">Playground</StyledText>
        <StyledView className="flex-row flex-wrap mb-4">
          {Object.keys(components).map((name) => (
            <Button
              key={name}
              title={name}
              onPress={() => setCurrentComponent(name)}
              className={`mr-2 mb-2 ${currentComponent === name ? 'bg-blue-600' : 'bg-blue-400'}`}
            />
          ))}
        </StyledView>

        <StyledView className="bg-black p-4 rounded-lg shadow-md">
          <StyledText className="bg-blue text-lg font-semibold mb-2">
            {currentComponent}
          </StyledText>
          <StyledView className="items-center">
            {currentComponent === 'Button' && (
              <Button
                title="Sample Button"
                onPress={() => console.log('Button pressed')}
              />
            )}
            {currentComponent === 'HodophileLogo' && (
              <HodophileLogo
                width={100}
                height={100}
                style={{ alignSelf: 'center', marginBottom: 20 }}
              />
            )}
            {currentComponent === 'CustomInput' && (
              <CustomInput
                containerClassName="bg-white rounded-text-input px-5 py-3 mb-4 mx-4 mt-4"
                inputClassName="text-base text-gray-800 placeholder-gray-400 h-full"
                placeholder="Enter text"
                value="Sample text"
                onChangeText={(text) => console.log('Text changed:', text)}
              />
            )}
            {currentComponent === 'SocialLoginButtons' && (
              <SocialLoginButtons
                onFacebookLogin={() => console.log('Facebook login')}
                onGoogleLogin={() => console.log('Google login')}
                onTwitterLogin={() => console.log('Twitter login')}
              />
            )}
            {currentComponent === 'TourCard' && (
              <TourCard
              tour_id={1}
              image_url="https://www.google.com/search?sca_esv=0a650f077e31c052&sxsrf=ADLYWIJNcPgjwQ8Suqsjjfvw7OR5q80IMA:1728397497537&q=tour+du+l%E1%BB%8Bch&udm=2&fbs=AEQNm0D7NTKsOqMPi-yhU7bWDsijXeHIssQxQHiKhz3Orm0Szk2q6O3Esev6DIwpyqAb2Bjzw1c6tpecNpib8dXrzqvm5FMzVkDrTKys67-6kfgAazMCh2q_2K2qBhHmEJZYCshG1iTAvRetXp22SK5ohCSOB6PJIyrTN9FR3xzqGR0ovW4m2ZB55JJTRB7IhjzOCQuJqJTsnB1suhjzOVTDvkNaXS1tQzS-lI2KUfw77X5zkGcSp5Y&sa=X&sqi=2&ved=2ahUKEwiI_fu2_v6IAxVTp1YBHWy-DPIQtKgLegQIGxAB&biw=1536&bih=738&dpr=1.25"
              destination="Đà Lạt"
              departure_location="Hồ Chí Minh"
              start_date="5"
              end_date="4x"
              price={5000000}
              name="Sample Tour"
              description="Sample description"
              created_at="2023-01-01T00:00:00Z"
              />
            )}
            {currentComponent === 'FeedbackCard' && (
              <FeedbackCard
                avatar={require('../assets/images/client-1.png')}
                message="Sample message"
                statement="Sample statement"
              />
            )}
            {currentComponent === 'ExpandablePanel' && (
              <ExpandablePanel
                tittle="Sample Title"
                content={['Sample content 1', 'Sample content 2']}
              />
            )}
          </StyledView>
        </StyledView>
        <StyledView className="mt-4">
          <Link href="/(auth)/sign-in" asChild>
            <Pressable className="bg-blue-500 p-3 rounded-lg mb-2">
              <Text className="text-white text-center">Go to SignIn</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/home" asChild>
            <Pressable className="bg-blue-500 p-3 rounded-lg">
              <Text className="text-white text-center">Go to Home</Text>
            </Pressable>
          </Link>
          <Link href={"/tours/search" as const} asChild>
            <Pressable className="bg-blue-500 p-3 rounded-lg">
              <Text className="text-white text-center">Go to Tour search</Text>
            </Pressable>
          </Link>
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
};

export default Playground;