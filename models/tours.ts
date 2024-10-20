import MESSAGE from '../constants/MESSAGE'
import { IApiResponse } from '../types/apiResponse'
import { ITour } from '../types/Tour.types'
import * as TourService from '../services/tours'

let tours: ITour[] = []

export const getAllTour = async (filters: Record<string, string> = {}): Promise<IApiResponse<ITour[]>> => {
    const response = await TourService.fetchAllTours(filters)
  
    if (response.status === 'success') {
      tours = response.data?.filter((tour): tour is ITour => tour !== undefined) ?? []
      return { status: 'success', data: tours, message: MESSAGE.tour.GET_TOUR_SUCCESS }
    } else {
      tours = []
      return { status: 'error', data: [], message: MESSAGE.tour.GET_TOUR_FAILED }
    }
  }
  
  /**
   * Filter tours by the provided options.
   */
  export const getTours = async (
    page: string = '1',
    filters: Record<string, string> = {}, // Accept filters as an object
    limit: string = '16'
  ): Promise<IApiResponse<ITour[]>> => {
    const response = await TourService.fetchTours(page, filters, limit)
  
    if (response.status === 'success') {
      const tours = response.data?.filter((tour): tour is ITour => tour !== undefined) ?? []
      return { status: 'success', data: tours, message: MESSAGE.tour.GET_TOUR_SUCCESS }
    } else {
      return { status: 'error', data: [], message: MESSAGE.tour.GET_TOUR_FAILED }
    }
  }
  
  /**
   * Fetch a single tour by its ID.
   */
  export const getTourById = async (tour_id: string): Promise<IApiResponse<ITour>> => {
    const response = await TourService.fetchTourById(tour_id)
  
    if (response.status === 'success' && response.data) {
      return { status: 'success', data: response.data, message: MESSAGE.tour.GET_TOUR_SUCCESS }
    } else {
      return { status: 'error', message: MESSAGE.tour.GET_TOUR_FAILED }
    }
  }
  
  /**
   * Submit a new tour or edit an existing tour.
   */
  export const submitTour = async (tour: Partial<ITour>): Promise<IApiResponse<ITour>> => {
    let response: IApiResponse<ITour>
    if (tour.tour_id) {
      // Edit existing tour
      response = await TourService.editTour(tour)
      if (response.status === 'success') {
        // Update the tour in the tours array
        return { status: 'success', data: tour, message: MESSAGE.tour.EDIT_TOUR_SUCCESS }
      }
    } else {
      // Add new tour
      response = await TourService.addTour(tour)
      if (response.status === 'success' && response.data) {
        // Add the new tour to the start of the tours array
        return { status: 'success', data: response.data, message: MESSAGE.tour.ADD_TOUR_SUCCESS }
      }
    }
    return { status: 'error', message: MESSAGE.tour.ADD_TOUR_FAILED }
  }
  
  /**
   * Delete a tour by its ID and remove it from the tour list.
   */
  export const deleteTour = async (tour_id: string): Promise<IApiResponse<ITour>> => {
    const response = await TourService.deleteTour(tour_id)
    if (response.status === 'success') {
      // Remove the tour with the given ID from the tours array
      tours = tours.filter((tour) => tour.tour_id !== Number(tour_id))
      return { status: 'success', message: MESSAGE.tour.DELETE_TOUR_SUCCESS }
    } else {
      return { status: 'error', message: MESSAGE.tour.DELETE_TOUR_FAILED }
    }
  }
  
