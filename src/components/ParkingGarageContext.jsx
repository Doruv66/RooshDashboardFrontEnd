import React, { createContext, useContext, useState } from 'react';

export const ParkingGarageContext = createContext();

export const useParkingGarage = () => {
    return useContext(ParkingGarageContext);
};

export const ParkingGarageProvider = ({ children }) => {
    const [parkingGarage, setParkingGarage] = useState(null);

    return (
        <ParkingGarageContext.Provider value={{ parkingGarage, setParkingGarage }}>
            {children}
        </ParkingGarageContext.Provider>
    );
};
