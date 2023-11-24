import React, { createContext, useContext, useState } from 'react';

export const ParkingGarageContext = createContext();

export const useParkingGarage = () => {
    return useContext(ParkingGarageContext);
};

export const ParkingGarageProvider = ({ children }) => {
    const [parkingGarage, setParkingGarage] = useState(null);
    const [isNewParkingGarage, setIsNewParkingGarage] = useState(false)
    const [newGarageAdded, setNewGarageAdded] = useState(false);
    const [newGarageId, setNewGarageId] = useState(null);

    const contextValue = {
        parkingGarage,
        setParkingGarage,
        isNewParkingGarage,
        setIsNewParkingGarage,
        newGarageAdded,
        setNewGarageAdded,
        newGarageId,
        setNewGarageId
    };

    return (
        <ParkingGarageContext.Provider value={ contextValue }>
            {children}
        </ParkingGarageContext.Provider>
    );
};
