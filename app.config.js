export default {
  expo: {
    name: "Hodophile",
    slug: "Hodophile",
    scheme: "hodophile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.svg",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3055/v1/api',
      EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY || 'd79e0f9e9dd0297ea8ce30b455d348ce5d912b2281a1a5b8260ddbf8dfd6c91c4b60d885fae60b053305b7330fa2489f6710eccc5d68d75fd0b1bc7116875d7f'
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hodophile.app",
      scheme: "hodophile"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/bg-heroBanner.png",
        backgroundColor: "#ffffff"
      },
      package: "com.hodophile.app",
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "hodophile",
              host: "*"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    entryPoint: "./app/index.tsx"
  }
}; 