const apiUrl = 'http://localhost:8080/pricelists';

const PriceListApi = {
  getPriceListByParkingGarage(garageId) {
    return fetch(`${apiUrl}/byParkingGarage/${garageId}`, {
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
};

export default PriceListApi;
