import React from 'react';
import { Stack } from 'expo-router';

const DetailsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]/booking"
        options={{
          headerShown: false,
        }}/>
    </Stack>
  );
};

export default DetailsLayout;