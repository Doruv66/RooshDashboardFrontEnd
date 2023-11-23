import React, {useEffect, useState} from "react";
import './GarageInput.css';
import { useParkingGarage } from "./ParkingGarageContext";
import ParkingGarageApi from '../api/ParkingGarageApi';
import isEqual from 'lodash/isEqual';
import { Box, Tab, Tabs } from '@mui/material';

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
    const { isNewParkingGarage, setIsNewParkingGarage } = useParkingGarage();
    const [errorMessage, setErrorMessage] = useState("")
    const [createdParkingGarageId, setCreatedParkingGarageId] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [tabOneData, setTabOneData] = useState({});
    const [tabTwoData, setTabTwoData] = useState({});
    const [tabThreeData, setTabThreeData] = useState({});
    const [newParkingGarage, setNewParkingGarage] = useState({})

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    }

    const TabOneContent = () => {
        return <div><div className="form-grid">
            {parkingGarageAttributes.map(attr => (
                <div className="parking-garage-container" key={attr}>
                    <span className="parking-garage-text">
                        {attr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    {renderEditableField(attr, isNewParkingGarage ? newParkingGarage[attr] : (parkingGarage ? parkingGarage[attr] : ''))}
                </div>
            ))}
            <div className="parking-garage-checkboxes-container">
                <label className="parking-garage-checkbox-label">
                    Electric parking spaces
                    <input type="checkbox"
                           checked={isNewParkingGarage ? newParkingGarage.parkingGarageUtility?.electricChargePoint || false : parkingGarage?.parkingGarageUtility?.electricChargePoint || false}
                           onChange={handleToggleEParking}
                    />
                </label>
                <label className="parking-garage-checkbox-label">
                    Toilets
                    <input type="checkbox"
                           onChange={handleToggleToilets}
                           checked={isNewParkingGarage ? newParkingGarage.parkingGarageUtility?.toilet || false : parkingGarage?.parkingGarageUtility?.toilet || false}
                    />
                </label>
            </div>
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
                        {renderEditableField(attr, isNewParkingGarage ? newParkingGarage.parkingGarageUtility[attr] : (parkingGarage ? parkingGarage.parkingGarageUtility[attr] : ''))}
                    </div>
                ))}
                <div className="parking-garage-checkboxes-container">
                    <label className="parking-garage-checkbox-label">
                        Electric parking spaces
                        <input type="checkbox"
                               checked={isNewParkingGarage ? false : parkingGarage?.parkingGarageUtility?.electricChargePoint || false}
                               onChange={handleToggleEParking}
                        />
                    </label>
                    <label className="parking-garage-checkbox-label">
                        Toilets
                        <input type="checkbox"
                               onChange={handleToggleToilets}
                               checked={isNewParkingGarage ? false : parkingGarage?.parkingGarageUtility?.toilet || false}
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

    const handleEditField = (field, value) => {
        setEditingField(field);
        setEditingValue(value);
    };

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
        if (parkingGarage && parkingGarage.parkingGarageUtility) {
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
        if (parkingGarage && parkingGarage.parkingGarageUtility) {
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
        ParkingGarageApi.createParkingGarage(parkingGarage)
            .then(handleResponse)
            .then(data => {
                console.log('Successfully created new parking garage: ', data);
                setCreatedParkingGarageId(data.id); 
                setIsNewParkingGarage(false);

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
                {tabValue === 0 && <TabOneContent />}
                {tabValue === 1 && <TabTwoContent />}
                {tabValue === 2 && <TabThreeContent />}
            </div>
    );
    
}

