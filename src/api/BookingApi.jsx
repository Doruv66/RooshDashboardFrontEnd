const apiUrl = 'http://localhost:8080/bookings';

const BookingApi = {
  
    getBooking(bookingId) {
      return fetch(`${apiUrl}/${bookingId}`);
    },
    
    getAllBookings() {
      return fetch(`${apiUrl}`);
    }
  };
  
  export default BookingApi;