import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import './GarageInput.css';
import { useParkingGarage } from "./ParkingGarageContext";
import ParkingGarageApi from '../api/ParkingGarageApi';
import { Box, Tab, Tabs } from '@mui/material';
import {useLocation, useNavigate} from "react-router-dom";
import TextField from '@mui/material/TextField';
export default function GarageInput(){
    const { parkingGarage, setParkingGarage } = useParkingGarage();
    const parkingGarageAttributes = ["name", "airport", "location", "travelTime", "travelDistance", "phoneNumber"];
    const parkingGarageUtilityAttributes = [ "parkingSpaces", "parkingSpacesElectric", "floors"];
    const [editingField, setEditingField] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const { isNewParkingGarage, setIsNewParkingGarage, setNewGarageAdded, setNewGarageId, updateTrigger, setUpdateTrigger } = useParkingGarage();
    const [errorMessage, setErrorMessage] = useState("")
    const [tabValue, setTabValue] = useState(0);
    const [newParkingGarage, setNewParkingGarage] = useState({})
    const [formValues, setFormValues] = useState({});
    const navigate = useNavigate();
    const tabOneRef = useRef(null);
    const tabTwoRef = useRef(null);
    const handleTabChange = (event, newValue) => {
        if (tabValue === 0 && tabOneRef.current) {
            const localValues = tabOneRef.current.getLatestValues();
            updateGlobalStateBeforeTabChange(0, localValues);
        }
        if (tabValue === 1 && tabTwoRef.current) {
            const localValues = tabTwoRef.current.getLatestValues();
            const updatedValues = { ...formValues, parkingGarageUtility: { ...formValues.parkingGarageUtility, ...localValues } };
            updateGlobalStateBeforeTabChange(1, updatedValues);
        }
        setTabValue(newValue);
    };

    const updateGlobalStateBeforeTabChange = (tabIndex, newValues) => {
        if (tabValue === tabIndex) {
            updateGlobalState(newValues);
        }
    };
    const updateGlobalState = (newValues) => {
        setFormValues(prev => ({ ...prev, ...newValues }));
        console.log(formValues)
    };

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

    const TabOneContent = forwardRef((props, ref) => {
        const [localValues, setLocalValues] = useState({});
        useEffect(() => {
            setLocalValues(formValues);
        }, [formValues]);

        useEffect(() => {
            if (tabValue !== 0) {
                console.log(localValues)
                updateGlobalState(localValues);
            }
        }, [tabValue]);

        const handleLocalChange = (attr, value) => {
            setLocalValues(prev => ({ ...prev, [attr]: value }));
            console.log(localValues)
        };

        const handleFormSubmit = (e) => {
            e.preventDefault();
            setTimeout(() => {
                if(isNewParkingGarage){
                    handleSaveNewParkingGarage()
                }
                else{
                    handleUpdateParkingGarage(localValues);
                }
            }, 0);
        };

        useImperativeHandle(ref, () => ({
            getLatestValues: () => {
                return localValues;
            }
        }));

        const textFields = parkingGarageAttributes.map(attr => (
            <TextField
                name={attr}
                key={attr}
                label={toTitleCase(attr)}
                className="textFieldMarginTop"
                value={localValues[attr] || ''}
                onChange={(e) => handleLocalChange(attr, e.target.value)}
            />
        ));

        return (
            <div>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-grid">
                        {textFields}
                    </div>
                    {!isNewParkingGarage && parkingGarage && (
                        <div className="crud-button-container">
                            <button type="submit" className="crud-button">
                                Update parking garage
                            </button>
                            <button type="button" className="crud-button" onClick={handleDeleteParkingGarage}>
                                Delete parking garage
                            </button>
                        </div>
                    )}
                    {isNewParkingGarage && (
                        <div className="crud-button-container">
                            <button type="submit" className="crud-button">
                                Save new parking garage
                            </button>
                        </div>
                    )}
                </form>
            </div>
        );
    });
    TabOneContent.displayName = 'TabOneContent';

    const TabTwoContent = forwardRef((props, ref) => {
        const [localValues, setLocalValues] = useState({});

        useEffect(() => {
            setLocalValues(formValues.parkingGarageUtility || {});
        }, [formValues]);

        const handleLocalChange = (attr, value) => {
            setLocalValues(prev => ({ ...prev, [attr]: value }));
            console.log(localValues)
        };

        useImperativeHandle(ref, () => ({
            getLatestValues: () => {
                return localValues;
            }
        }));

        const handleToggleEParking = () => {
            setLocalValues(prev => ({
                ...prev,
                electricChargePoint: !prev.electricChargePoint
            }));
        };

        const handleToggleToilets = () => {
            setLocalValues(prev => ({
                ...prev,
                toilet: !prev.toilet
            }));
        };
        const handleFormSubmit = (e) => {
            e.preventDefault();
            setTimeout(() => {
                if (isNewParkingGarage) {
                    handleSaveNewParkingGarage();
                } else {
                    handleUpdateParkingGarage({ parkingGarageUtility: localValues });
                }
            }, 0);
        };

        return (
            <div>
                <form onSubmit={handleFormSubmit}>
                    {parkingGarageUtilityAttributes.map(attr => (
                        <div className="parking-garage-utilities-container" key={attr}>
                            <TextField
                                key={attr}
                                label={toTitleCase(attr)}
                                className="textFieldMarginTop"
                                value={localValues[attr] || ''}
                                onChange={(e) => handleLocalChange(attr, e.target.value)}
                            />
                        </div>
                    ))}
                    <div className="parking-garage-checkboxes-container">
                        <label className="parking-garage-checkbox-label">
                            Electric parking spaces
                            <input type="checkbox"
                                   checked={localValues.electricChargePoint || false}
                                   onChange={handleToggleEParking}
                            />
                        </label>
                        <label className="parking-garage-checkbox-label">
                            Toilets
                            <input type="checkbox"
                                   onChange={handleToggleToilets}
                                   checked={localValues.toilet || false}
                            />
                        </label>
                    </div>
                    {!isNewParkingGarage && (
                        <div className="crud-button-container">
                            <button type="submit" className="crud-button">
                                Update parking garage
                            </button>
                            <button type="button" className="crud-button" onClick={handleDeleteParkingGarage}>
                                Delete parking garage
                            </button>
                        </div>
                    )}
                    {isNewParkingGarage && (
                        <div className="crud-button-container">
                            <button type="submit" className="crud-button">
                                Save new parking garage
                            </button>
                        </div>
                    )}
                </form>
            </div>
        );
    });
    TabTwoContent.displayName = 'TabTwoContent';

    const TabThreeContent = () => {
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
        const tabOneValues = tabOneRef.current ? tabOneRef.current.getLatestValues() : {};
        const tabTwoValues = tabTwoRef.current ? tabTwoRef.current.getLatestValues() : {};

        const updatedValues = {
            ...formValues,
            ...tabOneValues,
            parkingGarageUtility: {
                ...formValues.parkingGarageUtility,
                ...tabTwoValues
            }
        };

        const parkingGarageToSave = {
            ...updatedValues,
            travelTime: parseInt(updatedValues.travelTime || 0),
            travelDistance: parseInt(updatedValues.travelDistance || 0),
            parkingGarageUtility: {
                ...updatedValues.parkingGarageUtility,
                parkingSpaces: parseInt(updatedValues.parkingGarageUtility.parkingSpaces || 0),
                parkingSpacesElectric: parseInt(updatedValues.parkingGarageUtility.parkingSpacesElectric || 0),
                electricChargePoint: updatedValues.parkingGarageUtility.electricChargePoint || false,
                toilet: updatedValues.parkingGarageUtility.toilet || false
            }
        };

        ParkingGarageApi.createParkingGarage(parkingGarageToSave)
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


    const handleDeleteParkingGarage = (event) => {
        event.preventDefault();
        console.log(parkingGarage);
        ParkingGarageApi.deleteParkingGarage(parkingGarage.id)
            .then(handleResponse)
            .then(data => {
                setNewGarageId(1)
                setNewGarageAdded(true);
                console.log('Successfully deleted parking garage: ', data);
            })
            .catch(error => {
                console.error('Error deleting the parking garage:', error);
            });
    };

    const handleUpdateParkingGarage = (values) => {
        const updatedParkingGarage = {
            ...parkingGarage,
            ...values,
            parkingGarageUtility: {
                ...parkingGarage.parkingGarageUtility,
                ...values.parkingGarageUtility
            }
        };
        console.log(updatedParkingGarage)
        ParkingGarageApi.updateParkingGarage(updatedParkingGarage)
            .then(handleResponse)
            .then(data => {
                console.log(data)
                console.log('Successfully updated parking garage: ', data);
                setUpdateTrigger(prev => !prev);
                setNewGarageId(data.id)
                setNewGarageAdded(true);
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
                {tabValue === 0 && <TabOneContent ref={tabOneRef} />}
                {tabValue === 1 && <TabTwoContent ref={tabTwoRef} />}
                {tabValue === 2 && <TabThreeContent />}
            </div>
    );

}

