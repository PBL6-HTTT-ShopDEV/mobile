import API_CONFIG from '../config/api.config';
import { ITour, ITourFilters } from '../types/Tour.types';
import { IApiResponse } from '../types/apiResponse';

export const tourService = {
  async getTours(page = '1', filters: Record<string, string> = {}, limit = '16'): Promise<IApiResponse<ITour[]>> {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });

      const url = `${API_CONFIG.BASE_URL}/tour?${queryParams}`;
      console.log('Calling API:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS
      });

      const data = await response.json();
      console.log('Tours Response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách tour');
      }

      if (!Array.isArray(data.metadata)) {
        console.log('Invalid data structure:', data);
        return {
          status: 'success',
          message: 'Lấy danh sách tour thành công',
          data: []
        };
      }

      const mappedTours = data.metadata.map(tour => ({
        _id: tour._id,
        name: tour.name,
        price: tour.price,
        destination: tour.destination,
        departure_location: tour.departure_location,
        start_date: tour.start_date,
        end_date: tour.end_date,
        description: tour.description,
        thumbnail_url: tour.thumbnail,
        images: tour.images || [],
        status: tour.status,
        max_group_size: tour.max_group_size,
        created_at: tour.created_at,
        updated_at: tour.updated_at,
        created_by: tour.created_by,
        updated_by: tour.updated_by || tour.created_by
      }));

      return {
        status: 'success',
        message: data.message || 'Lấy danh sách tour thành công',
        data: mappedTours
      };
    } catch (error) {
      console.error("Error details:", error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
        data: []
      };
    }
  },

  async getTourById(id: string): Promise<IApiResponse<ITour>> {
    try {
      console.log('Original ID:', id);
      
      // Đúng theo router backend
      const url = `${API_CONFIG.BASE_URL}/tourbyid?tourId=${id}`;
      console.log('Calling API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...API_CONFIG.HEADERS,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Không thể lấy thông tin tour');
      }

      const tourData = data.metadata;
      console.log('Tour Data:', tourData);

      const defaultImage = 'https://via.placeholder.com/300x200';
      
      return {
        status: 'success',
        message: data.message || 'Lấy thông tin tour thành công',
        data: {
          _id: tourData._id,
          name: tourData.name || '',
          price: tourData.price || 0,
          destination: tourData.destination || '',
          departure_location: tourData.departure_location || '',
          start_date: tourData.start_date || new Date().toISOString(),
          end_date: tourData.end_date || new Date().toISOString(),
          description: tourData.description || '',
          thumbnail_url: tourData.thumbnail || tourData.thumbnail_url || defaultImage,
          images: (tourData.images || tourData.image_url || []).map(img => img || defaultImage).filter(Boolean),
          status: tourData.status || 'active',
          max_group_size: tourData.max_group_size || 0,
          created_at: tourData.created_at || new Date().toISOString(),
          updated_at: tourData.updated_at || new Date().toISOString(),
          created_by: tourData.created_by || '',
          updated_by: tourData.updated_by || tourData.created_by || '',
          schedule: tourData.schedule || []
        }
      };
    } catch (error) {
      console.error("Error details:", error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
        data: null
      };
    }
  },

  async searchTours(searchTerm: string, filters?: Record<string, string>): Promise<IApiResponse<ITour[]>> {
    try {
      const queryParams = new URLSearchParams({
        q: searchTerm || '',
        ...(filters || {})
      });

      const url = `${API_CONFIG.BASE_URL}/tour?${queryParams}`;
      console.log('Search URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS
      });

      const data = await response.json();
      console.log('Search response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể tìm kiếm tour');
      }

      // Map và kiểm tra dữ liệu trước khi trả về
      const tours = Array.isArray(data.metadata) ? data.metadata.map(tour => ({
        _id: tour._id || '',
        name: tour.name || '',
        price: tour.price || 0,
        destination: tour.destination || '',
        departure_location: tour.departure_location || '',
        start_date: tour.start_date || '',
        end_date: tour.end_date || '',
        description: tour.description || '',
        thumbnail_url: tour.thumbnail || '', // Đảm bảo luôn có giá trị
        images: Array.isArray(tour.images) ? tour.images : [],
        status: tour.status || 'active',
        max_group_size: tour.max_group_size || 0,
        created_at: tour.created_at || '',
        updated_at: tour.updated_at || '',
        created_by: tour.created_by || '',
        updated_by: tour.updated_by || ''
      })) : [];

      return {
        status: 'success',
        message: 'Tìm kiếm tour thành công',
        data: tours
      };
    } catch (error) {
      console.error("Error searching tours:", error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
        data: []
      };
    }
  }
}; 