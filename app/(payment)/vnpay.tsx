import React, { useEffect } from 'react'
import { WebView } from 'react-native-webview'
import { View, ActivityIndicator, Alert } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { validatePaymentReturn } from '../../utilities/vnpayUtils'

const VNPayScreen = () => {
  const params = useLocalSearchParams()
  const { paymentUrl } = params

  useEffect(() => {
    if (!paymentUrl) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin thanh toán')
      router.back()
    }
  }, [paymentUrl])

  const handleNavigationStateChange = (navState: { url: string }) => {
    if (navState.url.includes('myapp://payment-return')) {
      try {
        const url = new URL(navState.url)
        const params = Object.fromEntries(url.searchParams.entries())
        
        if (params.vnp_ResponseCode === '00' && params.vnp_TransactionStatus === '00') {
          router.replace({
            pathname: '/(payment)/payment-return',
            params
          })
        } else {
          Alert.alert('Thất bại', 'Thanh toán không thành công')
          router.replace('/(tabs)/home')
        }
      } catch (error) {
        console.error('Payment processing error:', error)
        Alert.alert('Lỗi', 'Có lỗi xảy ra trong quá trình xử lý thanh toán')
        router.replace('/(tabs)/home')
      }
    }
  }

  if (!paymentUrl) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: paymentUrl as string }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
          console.warn('WebView error:', nativeEvent)
          Alert.alert(
            'Lỗi',
            'Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.',
            [
              {
                text: 'OK',
                onPress: () => router.back()
              }
            ]
          )
        }}
      />
    </View>
  )
}

export default VNPayScreen