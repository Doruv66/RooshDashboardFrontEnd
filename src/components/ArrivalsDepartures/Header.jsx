import React from 'react'
import { Box, Typography, ToggleButton, ToggleButtonGroup, useMediaQuery } from '@mui/material'
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';  
import { useState } from 'react';

const Header = (props) => {
    const [selectedButton, setSelectedButton] = useState('arrivals');

    const handleButtonChange = (event, newSelectedButton) => {
        if (newSelectedButton !== null) {
        setSelectedButton(newSelectedButton);
        props.setOption(!props.option);
        }
    };
    const isSmallScreen = useMediaQuery('(max-width:1150px)');


  return (
    <Box sx={{display:'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '30px'}}>
            <Box sx={{flexDirection: 'column', alignContent: 'start'}}>
                 <Typography variant='h3'>{props.title}</Typography>
                 <Typography variant='p'>Arrivals & Departures</Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography variant='h' sx={{marginRight: '10px'}}>Show:</Typography>
                <ToggleButtonGroup
                value={selectedButton}
                exclusive
                onChange={handleButtonChange}
                aria-label="toggle button group"
                >
                    <ToggleButton
                    value="arrivals"
                    aria-label="arrivals"
                    sx={{
                        '&.Mui-selected': {
                        bgcolor: '#FF9000',
                        color: 'white', 
                        '&:hover': {
                            bgcolor: '#FF9000',
                            color: 'white', 
                        },
                        },
                        transition: 'background-color 0.3s, color 0.3s', 
                    }}
                    >
                    <FlightTakeoffIcon style={{ marginRight: '5px' }} /> Arrivals
                    </ToggleButton>
                    <ToggleButton
                    value="departures"
                    aria-label="departures"
                    sx={{
                        '&.Mui-selected': {
                        bgcolor: '#FF9000',
                        color: 'white', 
                        '&:hover': {
                            bgcolor: '#FF9000',
                            color: 'white', 
                        },
                        },
                        transition: 'background-color 0.3s, color 0.3s', // Smooth transition
                    }}
                    >
                    <FlightLandIcon style={{ marginRight: '5px' }} /> Departures
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
  )
}

export default Header