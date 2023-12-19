import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';  
import BookingApi from '../../api/BookingApi';
const TodaysCard = (props) => {
    const [arrivalsDepartures, setArrivalsDepartures] = useState(null);
    const refreshArrivalsDepartures = (date, garageId) => {
        BookingApi.getArrivalsDepartures(date, garageId)
        .then(response => {
            setArrivalsDepartures(response);
            props.setData(response);
        })
        .catch(error => console.log(error))
    };

    useEffect(() => {
        refreshArrivalsDepartures(new Date(), props.filters.garageId);
    }, []);

  return (
        arrivalsDepartures !== null ?
        <Card onClick={() => {
            props.setData(arrivalsDepartures)
            props.setTitle('Today');
        }}
            sx={{
                height: 150,
                width: 370,
                marginTop: "15px",
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', 
                transition: '0.3s',
                borderRadius: '8px',
                '&:hover': {
                boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', 
                },
            }}
            >
                <CardContent>
                    <Typography variant="h5">
                    TODAY
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '40px'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <FlightTakeoffIcon style={{fontSize: '50px', color: '#FF9000', marginRight: '10px', border: '1px ridge', borderRadius: '5px' }}/>
                            <Box sx={{display: 'flex', flexDirection: "column"}}>
                                <Typography variant='h5'>{arrivalsDepartures.arrivals.length}</Typography>
                                <Typography>ARRIVALS</Typography>
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <FlightLandIcon style={{fontSize: '50px', marginRight: '10px', color: '#FF9000', border: '1px ridge', borderRadius: '5px'}}/>
                            <Box sx={{display: 'flex', flexDirection: "column"}}>
                                <Typography variant='h5'>{arrivalsDepartures.departures.length}</Typography>
                                <Typography>DEPARTURES</Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
        </Card> : <Typography>This page is unavailable at the moment </Typography>
  )
}

export default TodaysCard