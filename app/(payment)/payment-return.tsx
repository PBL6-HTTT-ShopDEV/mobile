import { View, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)

// Định nghĩa type cho params
type VNPayResponse = {
  vnp_Amount: string
  vnp_BankCode: string
  vnp_BankTranNo: string
  vnp_CardType: string
  vnp_OrderInfo: string
  vnp_PayDate: string
  vnp_ResponseCode: string
  vnp_TmnCode: string
  vnp_TransactionNo: string
  vnp_TransactionStatus: string
  vnp_TxnRef: string
  vnp_SecureHash: string
}

export default function PaymentReturn() {
  const params = useLocalSearchParams<VNPayResponse>()
  const router = useRouter()
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
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking.',
      '10': 'Giao dịch không thành công do: Xác thực thông tin không đúng quá 3 lần.',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa.',
      '13': 'Giao dịch không thành công do nhập sai mật khẩu OTP.',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch.',
      '51': 'Giao dịch không thành công do: Số dư không đủ.',
      '65': 'Giao dịch không thành công do: Tài khoản vượt hạn mức giao dịch.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: Nhập sai mật khẩu quá số lần quy định.',
      '99': 'Các lỗi khác.',
    }
    return errorMessages[responseCode] || 'Giao dịch không thành công.'
  }

  const handleBackToHome = () => {
    router.replace('/(tabs)' as any)  // Type casting để tránh lỗi
  }

  return (
    <StyledView className="flex-1 items-center justify-center p-5 bg-white">
      {status === 'loading' ? (
        <StyledText className="text-gray-600">
          Đang xử lý kết quả thanh toán...
        </StyledText>
      ) : (
        <>
          <StyledView className={`w-20 h-20 rounded-full items-center justify-center mb-5 
            ${status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            <StyledText className="text-white text-4xl">
              {status === 'success' ? '✓' : '✕'}
            </StyledText>
          </StyledView>

          <StyledText className={`text-lg text-center mb-5 
            ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </StyledText>

          {status === 'success' && (
            <StyledView className="w-full p-5 bg-gray-50 rounded-lg mb-5">
              <StyledText className="text-base mb-2">
                Số tiền: {parseInt(params.vnp_Amount || '0') / 100} VNĐ
              </StyledText>
              <StyledText className="text-base mb-2">
                Mã giao dịch: {params.vnp_TransactionNo}
              </StyledText>
              <StyledText className="text-base mb-2">
                Ngân hàng: {params.vnp_BankCode}
              </StyledText>
            </StyledView>
          )}

          <Button
            title="Về trang chủ"
            onPress={handleBackToHome}
            className="mt-5"
          />
        </>
      )}
    </StyledView>
  )
} 