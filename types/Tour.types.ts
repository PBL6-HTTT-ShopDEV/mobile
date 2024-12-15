export interface ITour {
  _id: string;
  name: string;
  price: number;
  destination: string;
  departure_location: string;
  start_date: string;
  end_date: string;
  description: string;
  thumbnail_url: string;
  images: string[];
  schedule: {
    title: string;
    description: string;
    activities: string[];
  }[];
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  max_group_size: number;
  current_group_size: number;
  category_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface ITourFilters {
  destination?: string;
  price?: number | string;
  start_date?: string;
  page?: number | string;
  limit?: number | string;
}

export interface ITourResponse {
  status: string;
  message: string;
  metadata: {
    tours: ITour[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

export const convertToApiParams = (filters: ITourFilters): Record<string, string> => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);
};