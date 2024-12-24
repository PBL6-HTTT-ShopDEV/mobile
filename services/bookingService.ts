import  API_CONFIG  from '../config/api.config';
import { IApiResponse } from '../types/apiResponse';
import { IBooking } from '../types/Booking.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BookingService {
  private baseURL = `${API_CONFIG.BASE_URL}/bookings`;

  // Tạo booking mới
  async createBooking(bookingData: Partial<IBooking>): Promise<IApiResponse<IBooking>> {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        return {
          status: 'error',
          message: 'Vui lòng đăng nhập để đặt tour'
        };
      }

      const user = JSON.parse(userStr);
      const userId = user._id;

      console.log('Creating booking with userId:', userId);
      console.log('User data from storage:', user);

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.HEADERS['x-api-key'],
          'x-client-id': userId
        },
        body: JSON.stringify({
          ...bookingData,
          user: userId
        })
      });

      const data = await response.json();
      console.log('Booking API response:', data);

      if (!response.ok) {
        return {
          status: 'error', 
          message: data.message || 'Không thể tạo booking'
        };
      }

      return {
        status: 'success',
        message: 'Đặt tour thành công',
        data: data.metadata
      };

    } catch (error) {
      console.error('Booking service error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      };
    }
  }

  // Lấy danh sách booking của user
  async getBookingsByUserId(): Promise<IApiResponse<IBooking[]>> {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!userStr || !token) {
        return {
          status: 'error',
          message: 'Vui lòng đăng nhập'
        };
      }

      const user = JSON.parse(userStr);
      const userId = user._id;

      console.log('Fetching bookings with userId:', userId);

      // Sửa lại endpoint theo route trong backend
      const response = await fetch(`${this.baseURL}/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.HEADERS['x-api-key'],
          'x-client-id': userId,
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Get bookings API response:', data);

      if (!response.ok) {
        return {
          status: 'error',
          message: data.message || 'Không thể lấy danh sách booking'
        };
      }

      return {
        status: 'success',
        message: 'Lấy danh sách booking thành công',
        data: data.metadata
      };

    } catch (error) {
      console.error('Get bookings error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      };
    }
  }

  // Lấy chi tiết booking theo ID
  async getBookingById(id: string): Promise<IApiResponse<IBooking>> {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        return {
          status: 'error',
          message: 'Vui lòng đăng nhập'
        };
      }

      const response = await fetch(`${this.baseURL}/${id}`, {
        headers: {
          'x-api-key': API_CONFIG.HEADERS['x-api-key'],
          'x-client-id': userId
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: 'error',
          message: data.message || 'Không thể lấy thông tin booking'
        };
      }

      return {
        status: 'success',
        message: 'Lấy thông tin booking thành công',
        data: data.metadata
      };

    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      };
    }
  }

  // Cập nhật booking
  async updateBooking(id: string, updateData: Partial<IBooking>): Promise<IApiResponse<IBooking>> {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        return {
          status: 'error',
          message: 'Vui lòng đăng nhập'
        };
      }

      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.HEADERS['x-api-key'],
          'x-client-id': userId
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: 'error',
          message: data.message || 'Không thể cập nhật booking'
        };
      }

      return {
        status: 'success',
        message: 'Cập nhật booking thành công',
        data: data.metadata
      };

    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      };
    }
  }

  // Huỷ booking
  async cancelBooking(id: string): Promise<IApiResponse<IBooking>> {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        return {
          status: 'error',
          message: 'Vui lòng đăng nhập'
        };
      }

      const response = await fetch(`${this.baseURL}/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'x-api-key': API_CONFIG.HEADERS['x-api-key'],
          'x-client-id': userId
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: 'error',
          message: data.message || 'Không thể huỷ booking'
        };
      }

      return {
        status: 'success',
        message: 'Huỷ booking thành công',
        data: data.metadata
      };

    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      };
    }
  }

  // Kiểm tra khả năng đặt tour
  async checkAvailability(tourId: string, date: string, numberOfPeople: number): Promise<IApiResponse<boolean>> {
    try {
      const response = await fetch(
        `${this.baseURL}/check-availability?tourId=${tourId}&date=${date}&numberOfPeople=${numberOfPeople}`,
        {
          headers: {
            'x-api-key': API_CONFIG.HEADERS['x-api-key']
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          status: 'error',
          message: data.message || 'Không thể kiểm tra khả năng đặt tour'
        };
      }

      return {
        status: 'success',
        message: 'Kiểm tra khả năng đặt tour thành công',
        data: data.metadata.available
      };

    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      };
    }
  }
}

export default new BookingService(); 