import React, { useEffect } from 'react'
import { WebView } from 'react-native-webview'
import { View, ActivityIndicator, Alert } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { validatePaymentReturn } from '../../utilities/vnpayUtils'
import AsyncStorage from '@react-native-async-storage/async-storage'

const VNPayScreen = () => {
  const params = useLocalSearchParams()
  const { paymentUrl } = params

  useEffect(() => {
    if (!paymentUrl) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin thanh toán')
      router.back()
    }
  }, [paymentUrl])

  const handleNavigationStateChange = async (navState: { url: string }) => {
    if (navState.url.includes('vnp_ResponseCode')) {
      try {
        const urlObj = new URL(navState.url)
        const searchParams = new URLSearchParams(urlObj.search)
        const params = Object.fromEntries(searchParams.entries())
        
        const bookingId = await AsyncStorage.getItem('current_booking_id')
        
        router.replace({
          pathname: '/(payment)/payment-return',
          params: {
            ...params,
            bookingId: bookingId
          }
        })
      } catch (error) {
        console.error('Error processing payment response:', error)
        Alert.alert('Lỗi', 'Có lỗi xảy ra trong quá trình xử lý thanh toán')
        router.replace('/(tabs)/home')
      }
    }
  }

  const getErrorMessage = (responseCode: string = ''): string => {
    const errorMessages: Record<string, string> = {
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking.',
      '10': 'Xác thực thông tin không đúng quá 3 lần.',
      '11': 'Đã hết hạn chờ thanh toán.',
      '12': 'Thẻ/Tài khoản bị khóa.',
      '13': 'Nhập sai mật khẩu OTP.',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch.',
      '51': 'Số dư không đủ.',
      '65': 'Tài khoản vượt hạn mức giao dịch.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Nhập sai mật khẩu quá số lần quy định.',
      '99': 'Các lỗi khác.',
    }
    return errorMessages[responseCode] || 'Giao dịch không thành công.'
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