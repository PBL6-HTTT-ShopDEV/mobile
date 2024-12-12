import React from 'react';
import { Stack } from 'expo-router';

const PaymentLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="vnpay"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payment-return"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default PaymentLayout;