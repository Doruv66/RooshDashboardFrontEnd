import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";

const TabTwoContent = forwardRef(({
                                        formValues,
                                        errors,
                                        setErrors,
                                        isNewParkingGarage,
                                        handleSaveNewParkingGarage,
                                        handleUpdateParkingGarage,
                                        handleDeleteParkingGarage,
                                        updateGlobalState, toTitleCase
                                    }, ref) => {
    const [localValues, setLocalValues] = useState({});
    const parkingGarageUtilityAttributes = [ "parkingSpaces", "parkingSpacesElectric", "floors"];

    const dummyCheckboxes = [
        "Vehicle Inspection",
        "No Max Drive in Height",
        "Illuminated Garage",
        "Waiting Room",
        "Asphalt or Pavement",
        "Camera Security",
        "Fenced",
        "Baggage Help"
    ];


    useEffect(() => {
        setLocalValues(formValues.parkingGarageUtility || {});
        console.log(localValues)
    }, [formValues]);

    const handleLocalChange = (attr, value) => {
        setLocalValues(prev => ({ ...prev, [attr]: value }));
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
                            className="textField"
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
                    <div className="parking-garage-checkboxes-container">
                        {dummyCheckboxes.map(checkboxLabel => (
                            <label key={checkboxLabel} className="parking-garage-checkbox-label">
                                {checkboxLabel}
                                <input type="checkbox" />
                            </label>
                        ))}
                    </div>
                </div>
                {!isNewParkingGarage && (
                    <div className="crud-button-container">
                        <Button type="submit"
                                variant="contained"
                                sx={{
                                    width: 'max-content',
                                    margin: '5%',
                                    padding: "12px 20px",
                                    fontSize: "large",
                                    letterSpacing: "1px",
                                    textTransform: 'none',
                                    bgcolor: "#FF9000",
                                    '&:hover': {
                                        bgcolor: '#e80',
                                    },
                                    borderRadius: '10px',
                                    marginLeft: '5%',
                                }}>
                            Update parking garage
                        </Button>
                        <Button type="button"
                                variant="contained"
                                sx={{
                                    width: 'max-content',
                                    margin: '5%',
                                    padding: "12px 20px",
                                    fontSize: "large",
                                    letterSpacing: "1px",
                                    textTransform: 'none',
                                    bgcolor: "#FF9000",
                                    '&:hover': {
                                        bgcolor: '#e80',
                                    },
                                    borderRadius: '10px',
                                    marginLeft: '5%',
                                }}
                                onClick={handleDeleteParkingGarage}>
                            Delete parking garage
                        </Button>
                    </div>
                )}
                {isNewParkingGarage && (
                    <div className="crud-button-container">
                        <Button type="submit"
                                variant="contained"
                                sx={{
                                    width: 'max-content',
                                    margin: '5%',
                                    padding: "12px 20px",
                                    fontSize: "large",
                                    letterSpacing: "1px",
                                    textTransform: 'none',
                                    bgcolor: "#DA4A0C",
                                    '&:hover': {
                                        bgcolor: '#e80',
                                    },
                                    borderRadius: '10px',
                                    marginLeft: '5%',
                                }}>
                            Save new parking garage
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
});
TabTwoContent.displayName = 'TabTwoContent';
export default TabTwoContent;