import { Container, Box, Card, CardContent, Typography } from '@mui/material';

import { PiAirplaneLandingLight } from "react-icons/pi";
import { PiAirplaneTakeoffLight } from "react-icons/pi";    
import React from 'react'

const TomorrowsCard = () => {
  return (
    <Card
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
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '40px'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <PiAirplaneLandingLight style={{fontSize: '50px', marginRight: '10px', border: '1px ridge', borderRadius: '5px' }}/>
                            <Box sx={{display: 'flex', flexDirection: "column"}}>
                                <Typography variant='h5'>0</Typography>
                                <Typography>ARRIVALS</Typography>
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <PiAirplaneTakeoffLight style={{fontSize: '50px', marginRight: '10px', border: '1px ridge', borderRadius: '5px'}}/>
                            <Box sx={{display: 'flex', flexDirection: "column"}}>
                                <Typography variant='h5'>0</Typography>
                                <Typography>DEPARTURES</Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
        </Card>
  )
}

export default TomorrowsCard