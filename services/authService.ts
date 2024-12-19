import API_CONFIG from '../config/api.config';
import { LoginPayload, LoginResponse, SignupPayload, UpdateProfilePayload } from '../types/User.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      return data;
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

      const responseData = await response.json();
      console.log('Create Account Response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Đăng ký không thành công');
      }

      return responseData;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, updateData: UpdateProfilePayload) {
    try {
      const formData = new FormData();
      if (updateData.name) formData.append('name', updateData.name);
      if (updateData.phone_number) formData.append('phone_number', updateData.phone_number);
      if (updateData.address) formData.append('address', updateData.address);
      if (updateData.date_of_birth) formData.append('date_of_birth', updateData.date_of_birth);

      console.log('Update Account Request:', updateData);

      const updateResponse = await fetch(`${API_CONFIG.BASE_URL}/account/update?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'x-api-key': API_CONFIG.HEADERS['x-api-key']
        },
        body: formData
      });

      const updateResponseData = await updateResponse.json();
      console.log('Update Account Response:', updateResponseData);

      if (!updateResponse.ok) {
        throw new Error(updateResponseData.message || 'Cập nhật thông tin không thành công');
      }

      return updateResponseData;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  async getUserProfile(userId: string) {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Không tìm thấy token');

      const response = await fetch(`${API_CONFIG.BASE_URL}/account/get?userId=${userId}`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Get user profile response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin người dùng');
      }

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }
};