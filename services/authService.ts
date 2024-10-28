import { LoginPayload, LoginResponse, IUser } from '../types/User.types';
import Constants from 'expo-constants';

// Thay thế bằng URL của MockAPI của bạn
const MOCK_API_URL = 'https://6709fc51af1a3998baa2c1b0.mockapi.io/';

export const authService = {
  async login(credentials: LoginPayload): Promise<LoginResponse> {
    try {
      // Lấy danh sách users để check
      const response = await fetch(`${MOCK_API_URL}/users`);
      const users = await response.json();

      // Tìm user match với credentials
      const user = users.find(
        (u: IUser) => 
          u.email === credentials.email && 
          u.password === credentials.password
      );

      if (!user) {
        throw new Error('Email hoặc mật khẩu không chính xác');
      }

      // Tạo response với mock token
      const loginResponse: LoginResponse = {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          role: user.role,
          address: user.address
        },
        // Với mockapi không cần token thật
        token: `mock-token-${user.id}`,
        refreshToken: `mock-refresh-token-${user.id}`
      };

      return loginResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đã có lỗi xảy ra khi đăng nhập');
    }
  },

  async updateUser(token: string, userData: Partial<Omit<IUser, 'password'>>): Promise<Omit<IUser, 'password'>> {
    try {
      const userId = token.split('-')[2]; // Lấy id từ mock token
      const response = await fetch(`${MOCK_API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Cập nhật thông tin thất bại');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đã có lỗi xảy ra khi cập nhật thông tin');
    }
  },

  async logout(): Promise<void> {
    // Với mockapi, không cần thực hiện thao tác logout ở server
    return Promise.resolve();
  }
};