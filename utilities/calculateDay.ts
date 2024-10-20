export const calculateDaysAndNights = (start_date: string | Date, end_date: string | Date) => {
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
  
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1
    const totalNights = totalDays - 1
  
    return { days: totalDays, nights: totalNights }
  }
  