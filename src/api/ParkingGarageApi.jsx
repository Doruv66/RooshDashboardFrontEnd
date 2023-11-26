const apiUrl = 'http://localhost:8080/parkinggarage';

const ParkingGarageApi = {
  
  createParkingGarage(ParkingGarageData) {
    console.log(ParkingGarageData)
    return fetch(`${apiUrl}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
         Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
      },
      body: JSON.stringify(ParkingGarageData),
    });
  },
  
  updateParkingGarage(updatedParkingGarage) {  
    console.log(updatedParkingGarage);
    return fetch(`${apiUrl}/${updatedParkingGarage.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
       },
      body: JSON.stringify(updatedParkingGarage),
    });
  },
  
  deleteParkingGarage(parkingGarageId) {
    return fetch(`${apiUrl}/${parkingGarageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  },
  
  getParkingGarage(parkingGarageId) {
    return fetch(`${apiUrl}/${parkingGarageId}`, { headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  },
  
  getAllParkingGarages() {
    return fetch(`${apiUrl}`, { headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  }
};

export default ParkingGarageApi;
