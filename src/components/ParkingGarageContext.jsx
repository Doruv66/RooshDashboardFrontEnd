import React, { createContext, useContext, useState } from 'react';

export const ParkingGarageContext = createContext();

const dummyParkingGarage = {
    id: 1,
    name: "Central City Parking",
    airport: "City Airport",
    location: "123 Main St, Central City",
    travelTime: "15",
    travelDistance: "5000",
    phoneNumber: "555-1234",
    ParkingGarageUtility: {
      id: 1,
      toilets: true,
      amountOfParkingSpaces: 200,
      amountOfElectricParkingSpaces: 50,
      electricCharging: true,
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
