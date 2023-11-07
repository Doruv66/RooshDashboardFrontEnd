const apiUrl = 'http://localhost:8080/bookings';

const ParkingGarageApi = {
  
    getBooking(bookingId) {
      return fetch(`${apiUrl}/${bookingId}`);
    },
    
    getAllBookings() {
      return fetch(`${apiUrl}`);
    }
  };
  
  export default ParkingGarageApi;