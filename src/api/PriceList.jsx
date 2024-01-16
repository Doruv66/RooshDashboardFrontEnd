const apiUrl = 'http://localhost:8080/pricelists';

const PriceListApi = {
  getPriceListByParkingGarage(garageId) {
    return fetch(`${apiUrl}/byParkingGarage/${garageId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  },

  getPriceListByStartDateEndDate(startDate, endDate) {
    const queryParams = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
    });

    return fetch(`${apiUrl}/byStartDateEndDate?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  },

  createPriceList(priceListData) {
    return fetch(`${apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(priceListData),
    });
  },

  updatePriceList(priceListId, priceListData) {
    return fetch(`${apiUrl}/${priceListId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(priceListData),
    });
  },

  deletePriceList(priceList) {
    const startDate = priceList.startDate;
    const endDate = priceList.endDate;
    
    return fetch(`${apiUrl}?startDate=${startDate}&endDate=${endDate}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  },
  

  deleteParkingGarage(parkingGarageId) {
    return fetch(`${apiUrl}/${parkingGarageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  },
};

export default PriceListApi;
