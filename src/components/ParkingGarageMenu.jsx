import React, { useEffect, useState } from 'react';
import ParkingGarageApi from '../api/ParkingGarageApi';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useParkingGarage } from "./ParkingGarageContext";
import "./ParkingGarageMenu.css"

export default function ParkingGarageMenu() {
    const [parkingGarages, setParkingGarages] = useState([]);
    const { setParkingGarage, newGarageAdded, setNewGarageAdded, newGarageId, updateFilters, updateTrigger } = useParkingGarage();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedGarageId, setSelectedGarageId] = useState('');
    

    useEffect(() => {
        const fetchParkingGarages = async () => {
            setLoading(true);
            try {
                const response = await ParkingGarageApi.getAllParkingGarages();
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setParkingGarages(data.parkingGarages);

                if (newGarageAdded && newGarageId) {
                    const newGarage = data.parkingGarages.find(garage => garage.id === newGarageId);
                    if (newGarage) {
                        setParkingGarage(newGarage);
                        setSelectedGarageId(newGarageId);
                    }
                    setNewGarageAdded(false);
                }
            } catch (error) {
                console.error('Error fetching the parking garages:', error);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };
        fetchParkingGarages();
    }, [newGarageId, updateTrigger]);


    const handleChange = (event) => {
        const garageId = event.target.value;
        setSelectedGarageId(garageId);
        const selectedGarage = parkingGarages.find(garage => garage.id === garageId);
        setParkingGarage(selectedGarage);
        updateFilters({ garageId: selectedGarage.id });
    };

    return (
        <Box className="garageMenu">
            <FormControl fullWidth>
                <InputLabel id="parking-garage-select-label">Parking Garage</InputLabel>
                <Select
                    labelId="parking-garage-select-label"
                    id="parking-garage-select"
                    value={selectedGarageId}
                    label="Parking Garage"
                    onChange={handleChange}
                >
                    {loading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                    ) : error ? (
                        <MenuItem disabled>Error: {error}</MenuItem>
                    ) : (
                        parkingGarages.map((garage) => (
                            <MenuItem key={garage.id} value={garage.id}>{garage.name}</MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>
        </Box>
    );
}
