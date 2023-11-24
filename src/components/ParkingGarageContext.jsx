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
    const [filters, setFilters] = useState({
        garageId: null,
        service: '',
        finished: false,
        ongoing: false
    });

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const contextValue = {
        parkingGarage,
        setParkingGarage,
        isNewParkingGarage,
        setIsNewParkingGarage,
        newGarageAdded,
        setNewGarageAdded,
        newGarageId,
        setNewGarageId,
        filters,
        updateFilters
    };

    return (
        <ParkingGarageContext.Provider value={ contextValue }>
            {children}
        </ParkingGarageContext.Provider>
    );
};
