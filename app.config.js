export default {
  expo: {
    // ... other configs
    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3055/v1/api',
      EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY || 'd79e0f9e9dd0297ea8ce30b455d348ce5d912b2281a1a5b8260ddbf8dfd6c91c4b60d885fae60b053305b7330fa2489f6710eccc5d68d75fd0b1bc7116875d7f'
    },
  },
}; 