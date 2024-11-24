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
        // 1. Decode URL trước khi xử lý
        const decodedUrl = decodeURIComponent(navState.url)
        
        // 2. Parse URL và lấy params
        const urlObj = new URL(decodedUrl.replace('myapp://', 'http://'))
        const searchParams = new URLSearchParams(urlObj.search)
        
        // 3. Chuyển params về object và decode các giá trị
        const params = Object.fromEntries(
          Array.from(searchParams.entries()).map(([key, value]) => [
            key,
            decodeURIComponent(value)
          ])
        )
        
        // Validate và xử lý response
        if (validatePaymentReturn(params)) {
          if (params.vnp_ResponseCode === '00') {
            // Thanh toán thành công
            Alert.alert(
              'Thành công',
              'Thanh toán đã được xử lý thành công',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/home')
                }
              ]
            )
          } else {
            // Thanh toán thất bại
            const errorMessage = params.vnp_Message || 'Thanh toán không thành công'
            Alert.alert(
              'Thất bại',
              errorMessage,
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/home')
                }
              ]
            )
          }
        } else {
          throw new Error('Chữ ký không hợp lệ')
        }
      } catch (error) {
        console.error('Error processing payment:', error)
        Alert.alert('Lỗi', 'Có lỗi xảy ra trong quá trình xử lý')
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