import React, {useCallback, useEffect, useState} from "react";
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
    const location = useLocation();
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
        setFormValues(prev => ({ ...prev, [fieldName]: value }));
    }, []);

    const TabOneContent = () => {

        return <div><div className="form-grid">
            {parkingGarageAttributes.map(attr => (
                <TextField
                    key={attr}
                    label={toTitleCase(attr)}
                    className="textFieldMarginTop"
                    value={formValues[attr] || ''}
                    onChange={(e) => handleFieldChange(attr, e.target.value)}>
                    {renderEditableField(attr, isNewParkingGarage ? newParkingGarage[attr] : (parkingGarage ? parkingGarage[attr] : ''))}
                </TextField>
            ))}
        </div>
            <div className="crud-button-container">
                {isNewParkingGarage && (
                    <button className="crud-button" onClick={handleSaveNewParkingGarage}>
                        Save new parking garage
                    </button>
                )}
                {!isNewParkingGarage && parkingGarage &&(
                    <>
                        <button className="crud-button" onClick={handleDeleteParkingGarage}>
                            Delete {parkingGarage.name}
                        </button>
                        <button className="crud-button" onClick={handleUpdateParkingGarage}>
                            Update {parkingGarage.name}
                        </button>
                    </>
                )}
            </div>
        </div>;
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
                        {renderEditableField(attr, isNewParkingGarage ? (newParkingGarage.parkingGarageUtility && newParkingGarage.parkingGarageUtility[attr]) : (parkingGarage && parkingGarage.parkingGarageUtility && parkingGarage.parkingGarageUtility[attr]))}
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
        // Initialize formValues based on whether it's a new garage or an existing one
        const initialValues = parkingGarageAttributes.reduce((acc, attr) => {
            // For a new garage, all values should be initialized to empty strings
            // For an existing garage, use existing values or default to empty strings
            acc[attr] = isNewParkingGarage ? '' : (parkingGarage ? parkingGarage[attr] : '');
            return acc;
        }, {});

        // If it's a new garage, initialize parkingGarageUtility attributes to their default values
        if (isNewParkingGarage) {
            initialValues.parkingGarageUtility = parkingGarageUtilityAttributes.reduce((acc, attr) => {
                acc[attr] = ''; // Initialize utility attributes to empty strings
                return acc;
            }, {});
        } else {
            // For an existing garage, include the parkingGarageUtility attributes
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

    const handleSaveEditedField = (field) => {
        let garageToUpdate = isNewParkingGarage ? { ...newParkingGarage } : { ...parkingGarage };
        let valueToSave = editingValue;
    
        if (field === "travelTime" || field === "travelDistance" ||
            field === "floors" || field === "parkingSpacesElectric" || 
            field === "parkingSpaces") {
            valueToSave = parseInt(editingValue, 10); 
            console.log(valueToSave)
        }
    
        if (parkingGarageUtilityAttributes.includes(field)) {
            garageToUpdate = {
                ...garageToUpdate,
                parkingGarageUtility: {
                    ...garageToUpdate.parkingGarageUtility,
                    [field]: valueToSave
                }
            };
        } 
        else {
            garageToUpdate[field] = valueToSave;
        }

        if (!isEqual(garageToUpdate, parkingGarage)) {
            switch(field){
                case "name":
                    if(!garageToUpdate.name.trim()){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "airport":
                    if(!garageToUpdate.airport.trim()){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "location":
                    if(!garageToUpdate.location.trim()){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "travelTime":
                    if(garageToUpdate.travelTime == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "travelDistance":
                    if(garageToUpdate.travelDistance == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "phoneNumber":
                    if(!garageToUpdate.phoneNumber.trim()){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "amountOfParkingSpaces":
                    if(garageToUpdate.parkingGarageUtility.amountOfParkingSpaces == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "amountOfElectricParkingSpaces":
                    if(garageToUpdate.parkingGarageUtility.amountOfElectricParkingSpaces == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "floors":
                    if(garageToUpdate.parkingGarageUtility.floors == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
            }
            if (isNewParkingGarage) {
                setNewParkingGarage(garageToUpdate);
            } else {
                setParkingGarage(garageToUpdate);
            }
        }
        setEditingField(null);
        setEditingValue('');
    };

    const renderEditableField = (field, value) => {
        return editingField === field ? (
            <form onSubmit={(e) => {
                e.preventDefault();
                setErrorMessage(handleSaveEditedField(field))
            }}>
                <input
                    key={field}
                    className="parking-garage-edit"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    autoFocus
                />
                <button className="parking-garage-edit-button" type="submit">Save</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        ) : (
            <div
                className={`parking-garage-content ${errorMessage ? 'disabled' : ''}`}
                onClick={() => {
                    if (!errorMessage) {
                        setEditingField(field);
                        setEditingValue(value != null ? value : '');
                    }
                }}
            >
                {value != null ? value : ''}
            </div>
        );
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

