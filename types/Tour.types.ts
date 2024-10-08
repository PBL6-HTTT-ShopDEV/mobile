export interface ITourCard {
    tour_id: number
    name: string
    description: string
    price: number
    start_date: string
    end_date: string
    created_at: string
    destination: string
    image_url: string
    departure_location: string
    note?: string
  }