import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import './GarageInput.css';
import { useParkingGarage } from "./ParkingGarageContext";
import ParkingGarageApi from '../api/ParkingGarageApi';
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormGroup,
    FormLabel,
    ImageList,
    ImageListItem, Popover,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Grid";
export default function GarageInput(){
    const { parkingGarage, setParkingGarage } = useParkingGarage();
    const parkingGarageAttributes = ["name", "airport", "location", "travelTime", "travelDistance", "phoneNumber"];
    const parkingGarageUtilityAttributes = [ "parkingSpaces", "parkingSpacesElectric", "floors"];
    const [newImages, setNewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // For images already on the server
    const [imagesToRemove, setImagesToRemove] = useState([]); // For images to be removed
    const [previewImages, setPreviewImages] = useState([])
    const [editingField ,setEditingField] = useState(null);
    const [editingValue ,setEditingValue] = useState('');
    const { isNewParkingGarage, setIsNewParkingGarage, setNewGarageAdded, setNewGarageId, setUpdateTrigger } = useParkingGarage();
    const [tabValue, setTabValue] = useState(0);
    const [newParkingGarage, setNewParkingGarage] = useState({})
    const [formValues, setFormValues] = useState({});
    const navigate = useNavigate();
    const tabOneRef = useRef(null);
    const tabTwoRef = useRef(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [errors, setErrors] = useState({});
    const [imageError, setImageError] = useState("");

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
        console.log(isNewParkingGarage)
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
        console.log(formValues)
    };

    const toTitleCase = (str) => {
        return str
            // Insert a space before all caps
            .replace(/([A-Z])/g, ' $1')
            // Uppercase the first character of each word
            .replace(/^./, str => str.toUpperCase());
    }

    const TabOneContent = forwardRef((props, ref) => {
        const [localValues, setLocalValues] = useState({});
        const [anchorEl, setAnchorEl] = useState(null);

        const handlePopoverOpen = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handlePopoverClose = () => {
            setAnchorEl(null);
        };

        const open = Boolean(anchorEl);

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
            if (errors[attr]) {
                setErrors({ ...errors, [attr]: '' });
            }
            console.log(localValues)
        };

        const validateInput = (attr, value) => {
            if (!value) {
                return 'This field is required';
            }
            if (value.length > 255) {
                return `Maximum length is 255`;
            }
            if ((attr === 'travelTime' || attr === 'travelDistance') && !/^[0-9\b]+$/.test(value)) {
                return 'Only numbers are accepted';
            }
            return '';
        };

        const handleFormSubmit = (e) => {
            e.preventDefault();

            let newErrors = {};
            let formIsValid = true;

            Object.keys(localValues).forEach(attr => {
                const error = validateInput(attr, localValues[attr]);
                if (error) {
                    newErrors[attr] = error;
                    formIsValid = false;
                }
            });

            setErrors(newErrors);

            if (!formIsValid) {
                setConfirmationMessage("An input was invalid. Please check the errors and try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            } else {
                setTimeout(() => {
                    if (isNewParkingGarage) {
                        handleSaveNewParkingGarage(localValues);
                    } else {
                        handleUpdateParkingGarage(localValues);
                    }
                }, 0);
            }
        };

        useImperativeHandle(ref, () => ({
            getLatestValues: () => {
                return localValues;
            }
        }));

        const textFields = parkingGarageAttributes.map(attr => {
            let label = toTitleCase(attr);
            if (attr === 'travelTime') {
                label = label + ' (in minutes)';
            } else if (attr === 'travelDistance') {
                label = label + ' (in meters)';
            }

            const CoordinatesGroup = () => (
                <FormControl component="fieldset" className="coordinates-group" fullWidth>
                    <FormLabel component="legend" sx={{ml:2}}>Coordinates</FormLabel>
                    <FormGroup row sx={{ml:2}}>
                        <TextField
                            placeholder="Long"
                            variant="outlined"
                            sx={{backgroundColor: '#FFFFFF', width: '40%'}}
                            error={Boolean(errors[attr])}
                            helperText={errors[attr] || ''}
                        />
                        <TextField
                            placeholder="Lat"
                            variant="outlined"
                            sx={{backgroundColor: '#FFFFFF', width: '40%'}}
                            error={Boolean(errors[attr])}
                            helperText={errors[attr] || ''}
                        />
                    </FormGroup>
                </FormControl>
            );

            const AddressGroup = () => (
                <div className="address-details">
                    <FormControl component="fieldset" className="address-group" fullWidth>
                        <FormLabel component="legend" sx={{ml:2}}>Address Details</FormLabel>
                        <FormGroup sx={{ml:2}}>
                            <TextField
                                placeholder="Street and Address"
                                variant="outlined"
                                margin="normal"
                                sx={{backgroundColor: '#FFFFFF',width: '100%', mb:0}}
                            />
                            <TextField
                                margin="normal"
                                placeholder="Zip code"
                                sx={{ mr: 8}}
                            />
                            <TextField
                                margin="normal"
                                placeholder="City"
                            />
                            <TextField
                                placeholder="Country"
                                variant="outlined"
                                margin="normal"
                                sx={{backgroundColor: '#FFFFFF', width: '100%'}}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
            );

            return (
                <React.Fragment key={attr}>
                    {attr === 'airport' ? (
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <Button
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onClick={handlePopoverOpen}
                                variant="contained"
                                style={{ marginRight: '8px', flexShrink: 0, height: '56px', backgroundColor: '#FF9000' }}
                            >
                                Add Airport
                            </Button>
                            <TextField
                                name={attr}
                                error={Boolean(errors[attr])}
                                helperText={errors[attr] || ''}
                                label={label}
                                value={localValues[attr] || ''}
                                onChange={(e) => handleLocalChange(attr, e.target.value)}
                                variant="outlined"
                                style={{width:'70%'}}
                            />
                        </div>
                    ) : (
                        <TextField
                            error={Boolean(errors[attr])}
                            helperText={errors[attr] || ''}
                            name={attr}
                            label={label}
                            value={localValues[attr] || ''}
                            onChange={(e) => {
                                if (attr === 'travelTime' || attr === 'travelDistance') {
                                    const re = /^[0-9\b]+$/;
                                    if (e.target.value === '' || re.test(e.target.value)) {
                                        handleLocalChange(attr, e.target.value);
                                    }
                                } else {
                                    handleLocalChange(attr, e.target.value);
                                }
                            }}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                    )}
                    {attr === 'airport' && (
                        <Popover
                            id="mouse-over-popover"
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            sx={{
                                "& .MuiPaper-root": {
                                    width: "auto",
                                    maxWidth: "30%",
                                }
                            }}
                        >
                            <div className="form-grid">
                                <Box sx={{ padding: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,'&.MuiBox-root': {
                                        marginTop: '0px',}, }}>
                                    <Typography variant="h6" gutterBottom>
                                        Add a new Airport
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12}>
                                            <TextField
                                                label="IATA Airport Code"
                                                placeholder="Enter Code"
                                                variant="outlined"
                                                sx={{backgroundColor: '#FFFFFF',width: '100%', mt: 1, mb: 1}}
                                            />
                                            <TextField
                                                label="Terminal Name"
                                                placeholder="Enter Name"
                                                variant="outlined"
                                                sx={{backgroundColor: '#FFFFFF',width: '100%', mt: 1, mb: 1}}
                                            />
                                            <TextField
                                                label="Airport Name"
                                                placeholder="Enter Name"
                                                variant="outlined"
                                                sx={{backgroundColor: '#FFFFFF',width: '100%', mt: 1, mb: 2}}
                                            />
                                        </Grid>
                                        <AddressGroup/>
                                        <CoordinatesGroup/>
                                        <div className="button-container">
                                            <Button variant="contained" className="form-button" sx={{mr:2, ml:2, padding: '10px 40px'}}>Save</Button>
                                            <Button variant="contained" style={{ backgroundColor: '#ef1846'}} sx={{padding: '10px 40px'}} className="form-button">Delete</Button>
                                        </div>
                                    </Grid>
                                </Box>
                            </div>
                        </Popover>
                    )}
                </React.Fragment>
            );

        });

        return (
            <div>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-grid">
                        {textFields}
                        <TextField label="Address" className="textField" />
                        <TextField label="Zip Code" className="textField" />
                        <TextField label="City" className="textField" />
                        <TextField label="Country" className="textField" />
                    </div>
                    {!isNewParkingGarage && parkingGarage && (
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
                            <Button
                                variant="contained"
                                onClick={handleDeleteParkingGarage}
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
                            >
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
                                        bgcolor: "#FF9000",
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
    TabOneContent.displayName = 'TabOneContent';

    const TabTwoContent = forwardRef((props, ref) => {
        const [localValues, setLocalValues] = useState({});
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

    const TabThreeContent = () => {
        const handleFormSubmit = (e) => {
            e.preventDefault();
            setTimeout(() => {
                if (isNewParkingGarage) {
                    handleSaveNewParkingGarage();
                } else {
                    handleUpdateParkingGarage(formValues);
                }
            }, 0);
        };
        const removeImage = (imageBlobUrl) => {
            const imageIndex = previewImages.findIndex(img => img === imageBlobUrl);

            const image = existingImages.find(img => img.blobUrl === imageBlobUrl);
            if (image) {
                setExistingImages(existingImages.filter(img => img.blobUrl !== imageBlobUrl));
                setImagesToRemove([...imagesToRemove, image.path]);
            }

            if (imageIndex !== -1) {
                setNewImages(newImages.filter((_, index) => index !== imageIndex));
                setPreviewImages(previewImages.filter((_, index) => index !== imageIndex));
            }
        };
        return (
            <div>
                <form onSubmit={handleFormSubmit}>
                    <ImageList cols={6} gap={8}>
                        {previewImages.map((imageSrc, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={imageSrc}
                                    alt={`Preview ${index}`}
                                    loading="lazy"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'scale-down'
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => removeImage(imageSrc)}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                >
                                    <DeleteIcon />
                                </Button>
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <input
                        className="file-input"
                        accept="image/*"
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="raised-button-file" className="input-label">
                        <Button variant="contained" component="span" sx={{ mt: 2, mb: 2, backgroundColor: '#FF9000' }} className="input-label-button">
                            Upload Image
                        </Button>
                    </label>
                    {imageError && (
                        <Alert severity="error">
                            {imageError}
                        </Alert>
                    )}
                    {!isNewParkingGarage && parkingGarage && (
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
                            <Button
                                variant="contained"
                                onClick={handleDeleteParkingGarage}
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
                            >
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
                                        bgcolor: "#FF9000",
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
        )
    };
    TabThreeContent.displayName = 'TabThreeContent';

    useEffect(() => {
        console.log(newImages)
    }, [newImages]);

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
        console.log('FormData to be sent:', formDataForLog);


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
        console.log(parkingGarage);
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

        // Append form fields
        Object.keys(values).forEach(key => {
            if (key !== 'parkingGarageUtility') {
                formData.append(key, values[key]);
            }
        });

        // Append nested parkingGarageUtility fields to formData
        if (values.parkingGarageUtility) {
            Object.keys(values.parkingGarageUtility).forEach(key => {
                formData.append(`parkingGarageUtility.${key}`, values.parkingGarageUtility[key]);
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
                console.log(data)
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
            {tabValue === 0 && <TabOneContent ref={tabOneRef} />}
            {tabValue === 1 && <TabTwoContent ref={tabTwoRef} />}
            {tabValue === 2 && <TabThreeContent />}
        </div>
    );

}

