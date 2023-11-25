import React from 'react'
import { Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { PiAirplaneLandingLight } from "react-icons/pi";
import { PiAirplaneTakeoffLight } from "react-icons/pi";

const CustomCard = () => {
  return (
    <Card 
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
                <CardContent >
                <FormControl fullWidth sx={{width: 350, height: '40px'}}>
                    <InputLabel id="demo-simple-select-label">Interval</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={"Interval"}
                            label="Service"
                            style={{ height: '40px' }}      
                        >
                        <MenuItem value={"Arrival Day (asc)"}>This Month</MenuItem>
                        <MenuItem value={"Departure Day (asc)"}>Pick Dates</MenuItem>
                    </Select>
                </FormControl>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '30px'}}>
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

export default CustomCard