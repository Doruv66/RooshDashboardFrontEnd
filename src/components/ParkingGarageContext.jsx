import React, { createContext, useContext, useState } from 'react';

export const ParkingGarageContext = createContext();

const dummyParkingGarage = {
    id: 1,
    name: "Central city parking",
    airport: "City airport",
    location: "123 Main St, Central City",
    travelTime: "15",
    travelDistance: "5000",
    phoneNumber: "555-1234",
    ParkingGarageUtility: {
      id: 1,
      toilet: true,
      amountOfParkingSpaces: 200,
      amountOfElectricParkingSpaces: 50,
      electricChargePoint: true,
      floors: 5,
    },
  };

export const useParkingGarage = () => {
    return useContext(ParkingGarageContext);
};

export const ParkingGarageProvider = ({ children }) => {
    const [parkingGarage, setParkingGarage] = useState(dummyParkingGarage);

    return (
        <ParkingGarageContext.Provider value={{ parkingGarage, setParkingGarage }}>
            {children}
        </ParkingGarageContext.Provider>
    );
};
