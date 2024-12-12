import React, { useEffect, useState } from 'react'
import { View, Text, Alert } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import Button from '../../components/Button'

interface VNPayResponse {
  vnp_ResponseCode: string
  vnp_TransactionStatus: string
  vnp_Amount: string
  vnp_BankCode: string
  vnp_PayDate: string
  [key: string]: string
}

export default function PaymentReturn() {
  const params = useLocalSearchParams<VNPayResponse>()
  const [status, setStatus] = useState<'success' | 'failed' | 'loading'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    handlePaymentResult()
  }, [params])

  const handlePaymentResult = () => {
    try {
      if (params.vnp_ResponseCode === '00' && params.vnp_TransactionStatus === '00') {
        setStatus('success')
        setMessage('Thanh toán thành công!')
      } else {
        setStatus('failed')
        setMessage(getErrorMessage(params.vnp_ResponseCode))
      }
    } catch (error) {
      setStatus('failed')
      setMessage('Có lỗi xảy ra trong quá trình xử lý')
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

  const handleBackHome = () => {
    router.replace('/(tabs)/home')
  }

  return (
    <View className="flex-1 justify-center items-center p-4">
      {status === 'loading' ? (
        <Text className="text-xl">Đang xử lý kết quả thanh toán...</Text>
      ) : (
        <>
          <Text className={`text-2xl mb-4 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {status === 'success' ? '✓ Thành công' : '✗ Thất bại'}
          </Text>
          <Text className="text-lg text-center mb-8">{message}</Text>
          {status === 'success' && (
            <View className="mb-4">
              <Text className="text-base">Số tiền: {parseInt(params.vnp_Amount)/100} VNĐ</Text>
              <Text className="text-base">Ngân hàng: {params.vnp_BankCode}</Text>
              <Text className="text-base">Thời gian: {params.vnp_PayDate}</Text>
            </View>
          )}
          <Button 
            title="Về trang chủ" 
            onPress={handleBackHome}
            className="mt-4"
          />
        </>
      )}
    </View>
  )
} 