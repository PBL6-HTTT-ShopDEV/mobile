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
      console.log('Tour Response:', data);
      
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
        _id: tour._id.replace(/ObjectId\('(.+)'\)/, '$1'),
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
      const cleanId = id.replace(/ObjectId\('(.+)'\)/, '$1');
      
      const url = `${API_CONFIG.BASE_URL}/tour/${cleanId}`;
      console.log('Calling Tour Detail API:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS
      });
      
      const data = await response.json();
      console.log('Tour Detail Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin tour');
      }

      const tourData = data.metadata;
      const mappedTour = {
        _id: tourData._id.replace(/ObjectId\('(.+)'\)/, '$1'),
        name: tourData.name,
        price: tourData.price,
        destination: tourData.destination,
        departure_location: tourData.departure_location,
        start_date: tourData.start_date,
        end_date: tourData.end_date,
        description: tourData.description,
        thumbnail_url: tourData.thumbnail,
        images: tourData.images || [],
        status: tourData.status,
        max_group_size: tourData.max_group_size,
        created_at: tourData.created_at,
        updated_at: tourData.updated_at,
        created_by: tourData.created_by,
        updated_by: tourData.updated_by || tourData.created_by
      };
      
      return {
        status: 'success',
        message: data.message || 'Lấy thông tin tour thành công',
        data: mappedTour
      };
    } catch (error) {
      console.error("Error details:", error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      };
    }
  }
}; 