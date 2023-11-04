const apiUrl = 'http://localhost:8080/parkinggarage';

const ParkingGarageApi = {
  
  createParkingGarage(ParkingGarageData) {
    return fetch(`${apiUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ParkingGarageData),
    });
  },
  
  updateParkingGarage(updatedParkingGarage) {  
    return fetch(`${apiUrl}/${updatedParkingGarage.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedParkingGarage),
    });
  },  
  
  deleteParkingGarage(parkingGarageId) {
    return fetch(`${apiUrl}/${parkingGarageId}`, {
      method: 'DELETE',
    });
  },
  
  getParkingGarage(parkingGarageId) {
    return fetch(`${apiUrl}/${parkingGarageId}`);
  },
  
  getAllParkingGarages() {
    return fetch(`${apiUrl}`);
  }
};

export default ParkingGarageApi;
