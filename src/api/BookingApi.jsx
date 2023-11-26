const apiUrl = 'http://localhost:8080/bookings';

const BookingApi = {
  
    getBooking(bookingId) {
      return fetch(`${apiUrl}/${bookingId}`);
    },
    
    getAllBookings() {
      return fetch(`${apiUrl}`);
    },

    getFilteredBookings(garageId, service, finished, ongoing) {
      const filterUrl = `${apiUrl}/filter?garageId=${garageId}&service=${service}&finished=${finished}&ongoing=${ongoing}`;
      return fetch(filterUrl)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json(); // Just return the JSON data
          });
   },

   getArrivalsDepartures(date) {
    const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    const arrivalsDeparturesUrl = `${apiUrl}/arrivals-departures?date=${formattedDate}`;
    
    return fetch(arrivalsDeparturesUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
      });
  },

  async getIntervalArrivalsDepartures(startDate, endDate) {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    const intervalArrivalsDeparturesUrl = `${apiUrl}/bookings/interval-arrivals-departures?startTime=${formattedStartDate}&endTime=${formattedEndDate}`;
  
    try {
      const response = await fetch(intervalArrivalsDeparturesUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching interval arrivals departures:', error);
      throw error;
    }
  }
};
  
export default BookingApi;