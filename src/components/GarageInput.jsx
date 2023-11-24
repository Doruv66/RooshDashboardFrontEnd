import React, {useCallback, useEffect, useMemo, useState} from "react";
import './GarageInput.css';
import { useParkingGarage } from "./ParkingGarageContext";
import ParkingGarageApi from '../api/ParkingGarageApi';
import isEqual from 'lodash/isEqual';
import { Box, Tab, Tabs } from '@mui/material';
import {useLocation, useNavigate} from "react-router-dom";
import TextField from '@mui/material/TextField';
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function GarageInput(){
    const { parkingGarage, setParkingGarage } = useParkingGarage();
    const parkingGarageAttributes = ["name", "airport", "location", "travelTime", "travelDistance", "phoneNumber"];
    const parkingGarageUtilityAttributes = [ "parkingSpaces", "parkingSpacesElectric", "floors"];
    const [editingField, setEditingField] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const { isNewParkingGarage, setIsNewParkingGarage, setNewGarageAdded, setNewGarageId } = useParkingGarage();
    const [errorMessage, setErrorMessage] = useState("")
    const [tabValue, setTabValue] = useState(0);
    const [newParkingGarage, setNewParkingGarage] = useState({})
    const [formValues, setFormValues] = useState({});
    const navigate = useNavigate();
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    }

    const toTitleCase = (str) => {
        return str
            // Insert a space before all caps
            .replace(/([A-Z])/g, ' $1')
            // Uppercase the first character of each word
            .replace(/^./, str => str.toUpperCase());
    }

    const handleFieldChange = useCallback((fieldName, value) => {
        setParkingGarage(prev => ({ ...prev, [fieldName]: value }));
    }, []);

    const TabOneContent = () => {
        const textFields = useMemo(() => {
            return parkingGarageAttributes.map(attr => (
                <TextField
                    key={attr}
                    label={toTitleCase(attr)}
                    className="textFieldMarginTop"
                    defaultValue={formValues[attr] || ''}
                    onChange={(e) => handleFieldChange(attr, e.target.value)}
                />
            ));
        }, [parkingGarageAttributes, formValues, handleFieldChange]);

        return (
            <div>
                <div className="form-grid">
                    {textFields}
                </div>
                <div className="crud-button-container">
                    {isNewParkingGarage && (
                        <button className="crud-button" onClick={handleSaveNewParkingGarage}>
                            Save new parking garage
                        </button>
                    )}
                    {!isNewParkingGarage && parkingGarage && (
                        <>
                            <button className="crud-button" onMouseDown={handleDeleteParkingGarage}>
                                Delete parking garage
                            </button>
                            <button className="crud-button" onMouseDown={handleUpdateParkingGarage}>
                                Update parking garage
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };


    const TabTwoContent = () => {
        // Content and logic for Tab Two
        return (
            <div>
                {parkingGarageUtilityAttributes.map(attr => (
                    <div className="parking-garage-utilities-container" key={attr}>
                        <span className="parking-garage-text">
                            {attr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </span>
                    </div>
                ))}
                <div className="parking-garage-checkboxes-container">
                    <label className="parking-garage-checkbox-label">
                        Electric parking spaces
                        <input type="checkbox"
                               checked={isNewParkingGarage ? newParkingGarage.parkingGarageUtility?.electricChargePoint : parkingGarage?.parkingGarageUtility?.electricChargePoint}
                               onChange={handleToggleEParking}
                        />
                    </label>
                    <label className="parking-garage-checkbox-label">
                        Toilets
                        <input type="checkbox"
                               onChange={handleToggleToilets}
                               checked={isNewParkingGarage ? newParkingGarage.parkingGarageUtility?.toilet : parkingGarage?.parkingGarageUtility?.toilet}
                        />
                    </label>
                </div>
            </div>
        );
    };

    const TabThreeContent = () => {
        // Content and logic for Tab Three
        return <div>Tab Three Content</div>;
    };

    useEffect(() => {
        const initialValues = parkingGarageAttributes.reduce((acc, attr) => {
            acc[attr] = isNewParkingGarage ? '' : (parkingGarage ? parkingGarage[attr] : '');
            return acc;
        }, {});

        if (isNewParkingGarage) {
            initialValues.parkingGarageUtility = parkingGarageUtilityAttributes.reduce((acc, attr) => {
                acc[attr] = '';
                return acc;
            }, {});
        } else {
            initialValues.parkingGarageUtility = parkingGarage && parkingGarage.parkingGarageUtility ? {...parkingGarage.parkingGarageUtility} : {};
        }

        setFormValues(initialValues);
    }, [isNewParkingGarage, parkingGarage]);


    const handleResponse = response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    };

    const handleToggleEParking = () => {
        if (isNewParkingGarage) {
            setNewParkingGarage(prevState => ({
                ...prevState,
                parkingGarageUtility: {
                    ...prevState.parkingGarageUtility,
                    electricChargePoint: !prevState.parkingGarageUtility.electricChargePoint
                }
            }));
        } else if (parkingGarage && parkingGarage.parkingGarageUtility) {
            setParkingGarage(prevState => ({
                ...prevState,
                parkingGarageUtility: {
                    ...prevState.parkingGarageUtility,
                    electricChargePoint: !prevState.parkingGarageUtility.electricChargePoint
                }
            }));
        }
    };

    const handleToggleToilets = () => {
        if (isNewParkingGarage) {
            setNewParkingGarage(prevState => ({
                ...prevState,
                parkingGarageUtility: {
                    ...prevState.parkingGarageUtility,
                    toilet: !prevState.parkingGarageUtility.toilet
                }
            }));
        } else if (parkingGarage && parkingGarage.parkingGarageUtility) {
            setParkingGarage(prevState => ({
                ...prevState,
                parkingGarageUtility: {
                    ...prevState.parkingGarageUtility,
                    toilet: !prevState.parkingGarageUtility.toilet
                }
            }));
        }
    };

    useEffect(() => {
        if (isNewParkingGarage) {
            setEditingField(null);
            setEditingValue('');
        }
    }, [isNewParkingGarage]);


    useEffect(() => {
        if (isNewParkingGarage) {
            const emptyGarage = {
                ...parkingGarageAttributes.reduce((obj, attr) => ({ ...obj, [attr]: '' }), {}),
                parkingGarageUtility: {
                    ...parkingGarageUtilityAttributes.reduce((obj, attr) => ({ ...obj, [attr]: '' }), {}),
                    electricChargePoint: false,
                    toilet: false
                }
            };
            setNewParkingGarage(emptyGarage);
        }
    }, []);

    const handleSaveNewParkingGarage = () => {
        console.log(newParkingGarage)
        ParkingGarageApi.createParkingGarage(newParkingGarage)
            .then(handleResponse)
            .then(data => {
                console.log('Successfully created new parking garage: ', data);
                setNewGarageId(data.id);
                setIsNewParkingGarage(false);
                setNewGarageAdded(true);
                navigate(`/garagedetails`);
                return ParkingGarageApi.getParkingGarage(data.id); 
            })
            .then(handleResponse)
            .then(data => {
                console.log('Successfully retrieved new parking garage: ', data);
                setParkingGarage(data);
            })
            .catch(error => {
                console.error('Error with the parking garage:', error);
            });
    };
    

    const handleDeleteParkingGarage = () => {
        console.log(parkingGarage)
        ParkingGarageApi.deleteParkingGarage(parkingGarage.id) 
            .then(handleResponse)
            .then(data => {
                setParkingGarage(null);
                console.log('Successfully deleted parking garage: ', data);
            })
            .catch(error => {
                console.error('Error deleting the parking garage:', error);
            });
    };

    const handleUpdateParkingGarage = () => {
        ParkingGarageApi.updateParkingGarage(parkingGarage)
            .then(handleResponse)
            .then(data => {
                console.log('Successfully updated parking garage: ', data);
            })
            .catch(error => {
                console.error('Error updating the parking garage:', error);
            });
    };

    return (

            <div className="garage-input">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="General" />
                        <Tab label="Amenities" />
                        <Tab label="Images" />
                    </Tabs>
                </Box>
                {tabValue === 0 && <TabOneContent inputValues={formValues} handleInputChange={handleFieldChange} />}
                {tabValue === 1 && <TabTwoContent />}
                {tabValue === 2 && <TabThreeContent />}
            </div>
    );
    
}

