import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Box, Button, FormControl, FormGroup, FormLabel, Popover, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

const TabOneContent = forwardRef(({
                                      formValues,
                                      errors,
                                      setErrors,
                                      isNewParkingGarage,
                                      parkingGarage,
                                      tabValue,
                                      handleSaveNewParkingGarage,
                                      handleUpdateParkingGarage,
                                      handleDeleteParkingGarage,
                                      setConfirmationMessage,
                                      setSnackbarSeverity,
                                      setOpenSnackbar,
                                      toTitleCase,
                                      updateGlobalState
                                  }, ref) => {
    const [localValues, setLocalValues] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const parkingGarageAttributes = ["name", "airport", "location", "travelTime", "travelDistance", "phoneNumber"];
    const open = Boolean(anchorEl);
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setLocalValues(formValues);
    }, [formValues]);

    useEffect(() => {
        if (tabValue !== 0) {
            updateGlobalState(localValues);
        }
    }, [tabValue]);

    useImperativeHandle(ref, () => ({
        getLatestValues: () => {
            return localValues;
        }
    }));

    const handleLocalChange = (attr, value) => {
        setLocalValues(prev => ({...prev, [attr]: value}));
        if (errors[attr]) {
            setErrors({...errors, [attr]: ''});
        }
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
                <FormLabel component="legend" sx={{ml: 2}}>Coordinates</FormLabel>
                <FormGroup row sx={{ml: 2}}>
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
                    <FormLabel component="legend" sx={{ml: 2}}>Address Details</FormLabel>
                    <FormGroup sx={{ml: 2}}>
                        <TextField
                            placeholder="Street and Address"
                            variant="outlined"
                            margin="normal"
                            sx={{backgroundColor: '#FFFFFF', width: '100%', mb: 0}}
                        />
                        <TextField
                            margin="normal"
                            placeholder="Zip code"
                            sx={{mr: 8}}
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
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                        <Button
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onClick={handlePopoverOpen}
                            variant="contained"
                            style={{marginRight: '8px', flexShrink: 0, height: '56px', backgroundColor: '#FF9000'}}
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
                            style={{width: '70%'}}
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
                            <Box sx={{
                                padding: 3,
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                '&.MuiBox-root': {
                                    marginTop: '0px',
                                },
                            }}>
                                <Typography variant="h6" gutterBottom>
                                    Add a new Airport
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            label="IATA Airport Code"
                                            placeholder="Enter Code"
                                            variant="outlined"
                                            sx={{backgroundColor: '#FFFFFF', width: '100%', mt: 1, mb: 1}}
                                        />
                                        <TextField
                                            label="Terminal Name"
                                            placeholder="Enter Name"
                                            variant="outlined"
                                            sx={{backgroundColor: '#FFFFFF', width: '100%', mt: 1, mb: 1}}
                                        />
                                        <TextField
                                            label="Airport Name"
                                            placeholder="Enter Name"
                                            variant="outlined"
                                            sx={{backgroundColor: '#FFFFFF', width: '100%', mt: 1, mb: 2}}
                                        />
                                    </Grid>
                                    <AddressGroup/>
                                    <CoordinatesGroup/>
                                    <div className="button-container">
                                        <Button variant="contained" className="form-button" sx={{
                                            mr: 2,
                                            ml: 2,
                                            padding: '10px 40px',
                                            bgcolor: "#FF9000"
                                        }}>Save</Button>
                                        <Button variant="contained" style={{backgroundColor: '#ef1846'}}
                                                sx={{padding: '10px 40px'}} className="form-button">Delete</Button>
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
                    <TextField label="Address" className="textField"/>
                    <TextField label="Zip Code" className="textField"/>
                    <TextField label="City" className="textField"/>
                    <TextField label="Country" className="textField"/>
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
    TabOneContent.displayName = 'TabOneContent';
})
export default TabOneContent;