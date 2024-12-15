import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import CryptoJS from 'crypto-js'
import * as Network from 'expo-network'
import { router } from 'expo-router'
import querystring from 'qs'
import { Platform } from 'react-native'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

const VNP_PARAMS = {
  vnp_TmnCode: "S9033ATP",
  secretKey: "PKGAIR3W91FH035JPBBE39CCX9581PT8",
  vnp_CurrCode: "VND",
  vnp_Locale: "vn",
  vnp_OrderType: "other"
}

interface IPaymentParams {
  amount: number
  orderType?: string
}

interface IVnpParams {
  vnp_Version: string
  vnp_Command: string
  vnp_TmnCode: string
  vnp_Amount: number
  vnp_CreateDate: string
  vnp_CurrCode: string
  vnp_IpAddr: string
  vnp_Locale: string
  vnp_OrderInfo: string
  vnp_OrderType: string
  vnp_ReturnUrl: string
  vnp_TxnRef: string
  vnp_BankCode?: string  // Optional vì bankCode là tùy chọn
  [key: string]: string | number | undefined  // Thêm index signature
}

const handleVNPayPayment = async ({ amount, orderType = 'other' }: IPaymentParams): Promise<void> => {
  try {
    const ipAddr = await Network.getIpAddressAsync() || "127.0.0.1"
    
    let vnp_Params: IVnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: VNP_PARAMS.vnp_TmnCode,  
      vnp_Amount: amount*100,
      vnp_CreateDate: dayjs().format('YYYYMMDDHHmmss'),
      vnp_CurrCode: VNP_PARAMS.vnp_CurrCode,
      vnp_IpAddr: ipAddr,
      vnp_Locale: VNP_PARAMS.vnp_Locale,
      vnp_OrderInfo: 'Payment',
      vnp_OrderType: VNP_PARAMS.vnp_OrderType,
      vnp_ReturnUrl: encodeURIComponent('https://sandbox.vnpayment.vn/paymentv2/payment-return'),
      vnp_TxnRef: dayjs().unix().toString()
    }

    vnp_Params = Object.keys(vnp_Params)
      .sort((a, b) => a.localeCompare(b))
      .reduce<IVnpParams>((result: IVnpParams, key) => {
        const typedKey = key as keyof IVnpParams
        const value = vnp_Params[typedKey]
        if (value !== null && value !== undefined && value !== '') {
          result[typedKey] = value
        }
        return result
      }, {} as IVnpParams)

    const queryString = Object.keys(vnp_Params)
      .map((key) => `${key}=${vnp_Params[key as keyof IVnpParams]}`)
      .join('&')

    const secureHash = CryptoJS.HmacSHA512(queryString, VNP_PARAMS.secretKey).toString(CryptoJS.enc.Hex)

    const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${queryString}&vnp_SecureHash=${secureHash}`

    console.log('=== Payment Request ===')
    console.log(JSON.stringify({ amount, orderType }, null, 2))
    console.log('==================================================')
    console.log('Hash Generation:', JSON.stringify({
      secretKey: VNP_PARAMS.secretKey,
      secureHash,
      signData: queryString
    }, null, 2))
    console.log('=== Navigation Details ===')
    console.log(JSON.stringify({
      pathname: "/(payment)/vnpay",
      paymentUrl
    }, null, 2))
    console.log('==================================================')

    router.push({
      pathname: "/(payment)/vnpay" as never,
      params: { paymentUrl }
    })

  } catch (error) {
    console.error('Payment Error:', error)
    throw new Error('Không thể xử lý thanh toán')
  }
}

const validatePaymentReturn = (params: Record<string, string>): boolean => {
  const secureHash = params['vnp_SecureHash']
  const clonedParams = { ...params }
  delete clonedParams['vnp_SecureHash']
  delete clonedParams['vnp_SecureHashType']

  const sortedParams = Object.keys(clonedParams)
    .sort()
    .reduce((result: Record<string, string>, key) => {
      result[key] = clonedParams[key]
      return result
    }, {})

  const signData = querystring.stringify(sortedParams, { encode: false })
  const hmac = CryptoJS.HmacSHA512(signData, VNP_PARAMS.secretKey)
  const signed = hmac.toString(CryptoJS.enc.Hex)

  return secureHash === signed
}

export const validateVNPayResponse = (params: Record<string, string>): boolean => {
  try {
    const secureHash = params['vnp_SecureHash']
    
    // Clone và xóa hash fields
    const clonedParams = { ...params }
    delete clonedParams['vnp_SecureHash']
    delete clonedParams['vnp_SecureHashType']

    // Sort params
    const sortedParams = Object.keys(clonedParams)
      .sort()
      .reduce((result: Record<string, string>, key) => {
        result[key] = clonedParams[key]
        return result
      }, {})

    // Tạo query string
    const queryString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    // Tạo hash mới
    const hmac = CryptoJS.HmacSHA512(
      queryString,
      VNP_PARAMS.secretKey
    ).toString(CryptoJS.enc.Hex)

    // So sánh hash
    return secureHash === hmac
  } catch (error) {
    console.error('Validate Payment Error:', error)
    return false
  }
}

export { handleVNPayPayment, validatePaymentReturn }