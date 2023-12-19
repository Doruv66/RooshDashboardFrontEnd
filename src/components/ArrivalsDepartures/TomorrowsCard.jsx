import { Container, Box, Card, CardContent, Typography } from '@mui/material';
import BookingApi from '../../api/BookingApi';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';    
import React, { useState, useEffect}from 'react'

const TomorrowsCard = (props) => {
    const [arrivalsDepartures, setArrivalsDepartures] = useState(null);
    const refreshArrivalsDepartures = (date, garageId) => {
        BookingApi.getArrivalsDepartures(date, garageId)
        .then(response => setArrivalsDepartures(response))
        .catch(error => console.log(error))
    };

    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + 1);
        refreshArrivalsDepartures(tomorrow, props.filters.garageId);
    }, []);

  return (
    arrivalsDepartures !== null ?
    <Card onClick={() => {
        props.setData(arrivalsDepartures)
        props.setTitle("Tomorrow")
    }}
            sx={{
                height: 150,
                width: 370,
                marginTop: "15px",
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Shadow style
                transition: '0.3s',
                borderRadius: '8px',
                '&:hover': {
                boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', // Shadow on hover
                },
            }}
            >
                <CardContent >
                    <Typography variant="h5">
                    TOMORROW
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', color: '#FF9000', justifyContent: 'space-between', marginTop: '40px'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <FlightTakeoffIcon style={{fontSize: '50px', marginRight: '10px', border: '1px ridge', borderRadius: '5px' }}/>
                            <Box sx={{display: 'flex', flexDirection: "column"}}>
                                <Typography variant='h5'>{arrivalsDepartures.arrivals.length}</Typography>
                                <Typography>ARRIVALS</Typography>
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <FlightLandIcon style={{fontSize: '50px', color: '#FF9000', marginRight: '10px', border: '1px ridge', borderRadius: '5px'}}/>
                            <Box sx={{display: 'flex', flexDirection: "column"}}>
                                <Typography variant='h5'>{arrivalsDepartures.departures.length}</Typography>
                                <Typography>DEPARTURES</Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
        </Card> : <Typography>Nothing available try to enter this page later </Typography>
  )
}

export default TomorrowsCard