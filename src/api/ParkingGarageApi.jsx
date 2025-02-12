import TokenManager from "./TokenManager.jsx";

const apiUrl = 'http://localhost:8080/parkinggarage';

const ParkingGarageApi = {
  
  createParkingGarage(ParkingGarageData) {
    console.log(ParkingGarageData, "Saving Data")
    return fetch(`${apiUrl}`, {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${TokenManager.getAccessToken()}`
      },
      body: ParkingGarageData,
    });
  },
  
  updateParkingGarage(updatedParkingGarage, id) {
    console.log(updatedParkingGarage, id)
    return fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
       },
      body: updatedParkingGarage,
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
    console.log(localStorage.getItem('accessToken'))
    return fetch(`${apiUrl}/${parkingGarageId}`, { headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  },

  getParkingGaragesByUserId(userId) {
    return fetch(`${apiUrl}/user/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  },

  getAllParkingGarages() {
    return fetch(`${apiUrl}`, { headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  },
  async fetchImageWithToken(path, token) {
    const response = await fetch(`http://localhost:8080/${path}`, {
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    });
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}

export default ParkingGarageApi;
