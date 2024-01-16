import React, {useEffect, useRef, useState} from "react";
import './GarageInput.css';
import { useParkingGarage } from "./ParkingGarageContext";
import ParkingGarageApi from '../api/ParkingGarageApi';
import TabOneContent from "./TabOneContent.jsx";
import {
    Box,
    Tab,
    Tabs,
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TabTwoContent from "./TabTwoContent.jsx";
import TabThreeContent from "./TabThreeContent.jsx";


export default function GarageInput(){
    const { parkingGarage, setParkingGarage } = useParkingGarage();
    const parkingGarageAttributes = ["name", "airport", "location", "travelTime", "travelDistance", "phoneNumber"];
    const [newImages, setNewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [previewImages, setPreviewImages] = useState([])
    const { isNewParkingGarage, setIsNewParkingGarage, setNewGarageAdded, setNewGarageId, setUpdateTrigger } = useParkingGarage();
    const [tabValue, setTabValue] = useState(0);
    const [formValues, setFormValues] = useState({});
    const navigate = useNavigate();
    const tabOneRef = useRef(null);
    const tabTwoRef = useRef(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [errors, setErrors] = useState({});
    const [imageError, setImageError] = useState("");
    const parkingGarageUtilityAttributes = [ "parkingSpaces", "parkingSpacesElectric", "floors"];


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

    useEffect(() => {
        if (!isNewParkingGarage && parkingGarage && parkingGarage.imagePaths) {
            const fetchImages = async () => {
                try {
                    const fetchedImages = await Promise.all(
                        parkingGarage.imagePaths.map(async (path) => {
                            const blobUrl = await ParkingGarageApi.fetchImageWithToken(path, localStorage.getItem('accessToken'));
                            return { blobUrl, path };
                        })
                    );

                    setPreviewImages(fetchedImages.map(img => img.blobUrl));
                    setExistingImages(fetchedImages);
                } catch (error) {
                    console.error('Error fetching images:', error);
                }
            };

            fetchImages();
        }
        else if(isNewParkingGarage) {
            setPreviewImages([])
        }
    }, [isNewParkingGarage, parkingGarage]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const updateGlobalStateBeforeTabChange = (tabIndex, newValues) => {
        if (tabValue === tabIndex) {
            updateGlobalState(newValues);
        }
    };
    const updateGlobalState = (newValues) => {
        setFormValues(prev => ({ ...prev, ...newValues }));
    };

    const toTitleCase = (str) => {
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }

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

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const newImageFile = event.target.files[0];

            setNewImages(prevImages => [...prevImages, newImageFile]);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImages(prevPreviewImages => [...prevPreviewImages, reader.result]);
            };
            reader.readAsDataURL(newImageFile);
        }
    };

    const handleResponse = response => {
        if (!response.ok) {
            if (response.status === 400) {
                return response.json().then(errors => {
                    console.log(errors);
                    setImageError('');

                    errors.properties.errors.forEach((error) => {
                        if (error.field === "images") {
                            setImageError(error.error);
                        }
                    });
                });
            } else {
                throw new Error('Error');
            }
        }
        return response.json();
    };

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
        const formData = new FormData();

        Object.keys(parkingGarageToSave).forEach(key => {
            if (key !== 'parkingGarageUtility') {
                formData.append(key, parkingGarageToSave[key]);
            }
        });

        // Append nested parkingGarageUtility fields to formData
        if (parkingGarageToSave.parkingGarageUtility) {
            Object.keys(parkingGarageToSave.parkingGarageUtility).forEach(key => {
                formData.append(`parkingGarageUtility.${key}`, parkingGarageToSave.parkingGarageUtility[key]);
            });
        }

        // Append images to formData
        newImages.forEach((image, index) => {
            if (image) {
                formData.append(`images[${index}]`, image);
            }
        });

        const formDataEntries = Array.from(formData.entries());
        const formDataForLog = {};
        formDataEntries.forEach(([key, value]) => {
            formDataForLog[key] = value instanceof File ? value.name : value;
        });


        ParkingGarageApi.createParkingGarage(formData)
            .then(handleResponse)
            .then(data => {
                console.log('Successfully created new parking garage: ', data);
                setNewGarageId(data.id);
                setIsNewParkingGarage(false);
                setNewGarageAdded(true);
                setNewImages([])
                setImageError("")
                navigate(`/garagedetails`);
                return ParkingGarageApi.getParkingGarage(data.id);
            })
            .then(handleResponse)
            .then(data => {
                console.log('Successfully retrieved new parking garage: ', data);
                setConfirmationMessage('New parking garage successfully created.');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setParkingGarage(data);
            })
            .catch(error => {
                console.error('Error with the parking garage:', error);
                setConfirmationMessage('Error creating the parking garage.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };


    const handleDeleteParkingGarage = (event) => {
        event.preventDefault();
        ParkingGarageApi.deleteParkingGarage(parkingGarage.id)
            .then(handleResponse)
            .then(data => {
                setNewGarageId(1)
                setNewGarageAdded(true);
                console.log('Successfully deleted parking garage: ', data);
                setConfirmationMessage('Parking garage successfully deleted.');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            })
            .catch(error => {
                console.error('Error deleting the parking garage:', error);
                setConfirmationMessage('Error deleting the parking garage.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };

    const handleUpdateParkingGarage = (values) => {
        const formData = new FormData();
        let valuesToSend = values;

        if (tabValue === 1 && tabTwoRef.current) {
            const localValues = tabTwoRef.current.getLatestValues();
            valuesToSend = { ...formValues, parkingGarageUtility: { ...formValues.parkingGarageUtility, ...localValues } };
        }

        // Append form fields
        Object.keys(valuesToSend).forEach(key => {
            if (key !== 'parkingGarageUtility') {
                formData.append(key, valuesToSend[key]);
            }
        });

        // Append nested parkingGarageUtility fields to formData
        if (valuesToSend.parkingGarageUtility) {
            Object.keys(valuesToSend.parkingGarageUtility).forEach(key => {
                formData.append(`parkingGarageUtility.${key}`, valuesToSend.parkingGarageUtility[key]);
            });
        }

        // Append new images to formData
        newImages.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });

        imagesToRemove.forEach((imagePath, index) => {
            formData.append(`imagesToRemove[${index}]`, imagePath);
        });
        ParkingGarageApi.updateParkingGarage(formData, parkingGarage.id)
            .then(handleResponse)
            .then(data => {
                console.log('Successfully updated parking garage: ', data);
                setConfirmationMessage('Parking garage successfully updated.');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setUpdateTrigger(prev => !prev);
                setNewGarageId(data.id)
                setNewGarageAdded(true);
                setNewImages([])
                setImageError("")
            })
            .catch(error => {
                console.error('Error updating the parking garage:', error);
                setConfirmationMessage('Error updating the parking garage.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };

    return (

        <div className="garage-input">
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    elevation={6}
                    variant="filled"
                >
                    {confirmationMessage}
                </MuiAlert>
            </Snackbar>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="General" />
                    <Tab label="Amenities" />
                    <Tab label="Images" />
                </Tabs>
            </Box>
            {tabValue === 0 && (
                <TabOneContent
                    ref={tabOneRef}
                    formValues={formValues}
                    errors={errors}
                    setErrors={setErrors}
                    isNewParkingGarage={isNewParkingGarage}
                    parkingGarage={parkingGarage}
                    tabValue={tabValue}
                    handleSaveNewParkingGarage={handleSaveNewParkingGarage}
                    handleUpdateParkingGarage={handleUpdateParkingGarage}
                    handleDeleteParkingGarage={handleDeleteParkingGarage}
                    setConfirmationMessage={setConfirmationMessage}
                    setSnackbarSeverity={setSnackbarSeverity}
                    setOpenSnackbar={setOpenSnackbar}
                    toTitleCase={toTitleCase}
                    updateGlobalState={updateGlobalState}
                />
            )}
            {tabValue === 1 && (
                <TabTwoContent
                    ref={tabTwoRef}
                    formValues={formValues}
                    errors={errors}
                    setErrors={setErrors}
                    isNewParkingGarage={isNewParkingGarage}
                    handleSaveNewParkingGarage={handleSaveNewParkingGarage}
                    handleUpdateParkingGarage={handleUpdateParkingGarage}
                    handleDeleteParkingGarage={handleDeleteParkingGarage}
                    updateGlobalState={updateGlobalState}
                    toTitleCase={toTitleCase}
                />
            )}
            {tabValue === 2 && (
                <TabThreeContent
                    previewImages={previewImages}
                    setPreviewImages={setPreviewImages}
                    existingImages={existingImages}
                    setExistingImages={setExistingImages}
                    newImages={newImages}
                    setNewImages={setNewImages}
                    setImagesToRemove={setImagesToRemove}
                    imagesToRemove={imagesToRemove}
                    handleFileChange={handleFileChange}
                    imageError={imageError}
                    isNewParkingGarage={isNewParkingGarage}
                    parkingGarage={parkingGarage}
                    handleSaveNewParkingGarage={handleSaveNewParkingGarage}
                    handleUpdateParkingGarage={handleUpdateParkingGarage}
                    handleDeleteParkingGarage={handleDeleteParkingGarage}
                    formValues={formValues}
                />
            )}
        </div>
    );

}

