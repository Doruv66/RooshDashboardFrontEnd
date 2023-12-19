const apiUrl = 'http://localhost:8080/bookings';

const BookingApi = {
  
    getBooking(bookingId) {
      return fetch(`${apiUrl}/${bookingId}`, { headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }
    );
    },
    
    getAllBookings() {
      return fetch(`${apiUrl}`, { headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    },

    getBookingStatistics(startDate, garageId) {
      return fetch(`${apiUrl}/getBookingStatistics?startDate=${startDate}&garageId=${garageId}`, { headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    },

    getFilteredBookings(garageId, service, finished, ongoing) {
      const filterUrl = `${apiUrl}/filter?garageId=${garageId}&service=${service}&finished=${finished}&ongoing=${ongoing}`;
      return fetch(filterUrl, { headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json(); // Just return the JSON data
          });
   },

   getArrivalsDepartures(date, garageId) {
    const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    const arrivalsDeparturesUrl = `${apiUrl}/arrivals-departures?date=${formattedDate}&garageId=${garageId}`;
    
      return fetch(arrivalsDeparturesUrl, { headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
      });
  },

  async getIntervalArrivalsDepartures(startDate, endDate, garageId) {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    const intervalArrivalsDeparturesUrl = `${apiUrl}/bookings/interval-arrivals-departures?startTime=${formattedStartDate}&endTime=${formattedEndDate}&garageId=${garageId}`;
  
    try {
      const response = await fetch(intervalArrivalsDeparturesUrl, { headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
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