import API_CONFIG from '../config/api.config';
import { LoginPayload, LoginResponse } from '../types/User.types';


export const authService = {
  async login(credentials: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/account/login`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Email hoặc mật khẩu không chính xác');
      }

      return data as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đã có lỗi xảy ra khi đăng nhập');
    }
  },

  async signup(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/account/signup`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký không thành công');
      }

      return data as LoginResponse;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }
};