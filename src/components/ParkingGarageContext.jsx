import React, { createContext, useContext, useState } from 'react';

export const ParkingGarageContext = createContext();

export const useParkingGarage = () => {
    return useContext(ParkingGarageContext);
};

export const ParkingGarageProvider = ({ children }) => {
    const [parkingGarage, setParkingGarage] = useState(null);
    const [isNewParkingGarage, setIsNewParkingGarage] = useState(false)

    const contextValue = {
        parkingGarage,
        setParkingGarage,
        isNewParkingGarage,
        setIsNewParkingGarage
    };

    return (
        <ParkingGarageContext.Provider value={ contextValue }>
            {children}
        </ParkingGarageContext.Provider>
    );
};
