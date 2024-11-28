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
  const [status, setStatus] = useState<'success' | 'failed'>('success')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!params || Object.keys(params).length === 0) {
      setStatus('failed')
      setMessage('Không tìm thấy thông tin thanh toán')
      return
    }

    if (params.vnp_ResponseCode === '00' && params.vnp_TransactionStatus === '00') {
      setStatus('success')
      setMessage('Thanh toán thành công!')
    } else {
      setStatus('failed')
      setMessage('Thanh toán thất bại!')
    }
  }, [params])

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-4">
        {status === 'success' ? '✅ Thành công' : '❌ Thất bại'}
      </Text>
      <Text className="text-lg text-center mb-8">{message}</Text>
      <Button 
        title="Về trang chủ" 
        onPress={() => router.replace('/(tabs)/home')} 
      />
    </View>
  )
} 