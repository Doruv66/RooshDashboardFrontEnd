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
  }
  };
  
  export default BookingApi;