import MESSAGE from '../constants/MESSAGE'
import { IApiResponse } from '../types/apiResponse'
import { ITour } from '../types/Tour.types'
import Constants from 'expo-constants';
const url = `${Constants.expoConfig.extra.EXPO_PUBLIC_API_URL}${Constants.expoConfig.extra.EXPO_PUBLIC_API_ENDPOINT_TOURS}`;
export const fetchAllTours = async (filters: Record<string, string> = {}): Promise<IApiResponse<ITour[]>> => {
    try {
      const calledUrl = new URL(url)
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          calledUrl.searchParams.append(key, value)
        }
      })
      const response = await fetch(calledUrl.toString())
  
      if (!response.ok) {
        return {
          status: 'error',
          message: MESSAGE.common.NOT_FOUND
        }
      }
  
      const data = await response.json()
      return {
        status: 'success',
        message: MESSAGE.tour.GET_TOUR_SUCCESS,
        data
      }
    } catch (error: unknown) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
  export const fetchTours = async (
    page = '1',
    filters: Record<string, string> = {}, // Accept filters as an object
    limit = '16'
  ): Promise<IApiResponse<ITour[]>> => {
    try {
      const calledUrl = new URL(url)
      calledUrl.searchParams.append('page', page)
      calledUrl.searchParams.append('limit', limit)
  
      // Loop through filters and append them to the search parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          calledUrl.searchParams.append(key, value)
        }
      })
  
      const response = await fetch(calledUrl.toString())
  
      if (!response.ok) {
        return {
          status: 'error',
          message: MESSAGE.common.NOT_FOUND
        }
      }
  
      const data = await response.json()
      return {
        status: 'success',
        message: MESSAGE.tour.FILTER_TOUR_SUCCESS,
        data
      }
    } catch (error: unknown) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
  
  /**
   * Fetch a single tour by its ID.
   */
  export const fetchTourById = async (id: string): Promise<IApiResponse<ITour>> => {
    try {
      const response = await fetch(`${url}/${id}`)
  
      if (!response.ok) {
        return {
          status: 'error',
          message: MESSAGE.tour.GET_TOUR_FAILED
        }
      }
  
      const data = await response.json()
      return {
        status: 'success',
        message: MESSAGE.tour.GET_TOUR_SUCCESS,
        data
      }
    } catch (error: unknown) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
  
  /**
   * Add a new tour.
   */
  export const addTour = async (newTour: Partial<ITour>): Promise<IApiResponse<ITour>> => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTour)
      })
  
      if (!response.ok) {
        return {
          status: 'error',
          message: MESSAGE.tour.ADD_TOUR_FAILED
        }
      }
  
      const data = await response.json()
      return {
        status: 'success',
        message: MESSAGE.tour.ADD_TOUR_SUCCESS,
        data
      }
    } catch (error: unknown) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
  
  /**
   * Edit an existing tour.
   */
  export const editTour = async (newTour: Partial<ITour>): Promise<IApiResponse<ITour>> => {
    try {
      if (!newTour.tour_id) {
        throw new Error('Tour ID is required for editing.')
      }
  
      const response = await fetch(`${url}/${newTour.tour_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTour)
      })
  
      if (!response.ok) {
        return {
          status: 'error',
          message: MESSAGE.tour.EDIT_TOUR_FAILED
        }
      }
  
      const data = await response.json()
      return {
        status: 'success',
        message: MESSAGE.tour.EDIT_TOUR_SUCCESS,
        data
      }
    } catch (error: unknown) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
  
  /**
   * Delete a tour by its ID.
   */
  export const deleteTour = async (id: string): Promise<IApiResponse<ITour>> => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE'
      })
  
      if (!response.ok) {
        return {
          status: 'error',
          message: MESSAGE.tour.DELETE_TOUR_FAILED
        }
      }
  
      const data = await response.json()
      return {
        status: 'success',
        message: MESSAGE.tour.DELETE_TOUR_SUCCESS,
        data
      }
    } catch (error: unknown) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }