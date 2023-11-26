import React, { useEffect, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';  
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BookingApi from '../../api/BookingApi';

const CustomCard = (props) => {
    const [arrivalsDepartures, setArrivalsDepartures] = useState(null);
    const [interval, setInterval] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleIntervalChange = (event) => {
        setInterval(event.target.value);

    }

    const formatDateString = (startDate, endDate) => {
        if (!startDate || !endDate || !dayjs.isDayjs(startDate) || !dayjs.isDayjs(endDate)) {
          return 'Select Dates';
        }
        const formattedStartDate = startDate.format('MM DD YYYY');
        const formattedEndDate = endDate.format('MM DD YYYY');
        return `${formattedStartDate} - ${formattedEndDate}`;
    };

    const refreshArrivalsDepartures = async (startDate, endDate) => {
        try {
            const response = await BookingApi.getIntervalArrivalsDepartures(startDate, endDate);
            setArrivalsDepartures(response);
            if(interval === "Pick Dates") {
                props.setData(response);
            } else if (interval === "This Month") {
                props.setData(response);
                const currentDate = new Date();
                const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
                props.setTitle(currentMonth);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const refreshArrivalsDeparturesForThisMonth = async (startDate, endDate) => {
        try {
            const response = await BookingApi.getIntervalArrivalsDepartures(startDate, endDate);
            setArrivalsDepartures(response);
            props.setData(response);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if(interval === "This Month") {
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            setStartDate(firstDayOfMonth);
            setEndDate(lastDayOfMonth);
        } else if (interval === "Pick Dates") {
            setArrivalsDepartures(null);
            setStartDate(null);
            setEndDate(null);
        }
    }, [interval]);

    useEffect(() => {
        if(startDate && endDate) {
            refreshArrivalsDepartures(startDate, endDate);
            if(interval === "Pick Dates") {
                props.setTitle(formatDateString(startDate, endDate));
            } 
        }
    }, [startDate, endDate]);

  return (
    <Card onClick={() => {
        props.setData(arrivalsDepartures);
        if(interval === "This Month") {
            const currentDate = new Date();
            const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
            props.setTitle(currentMonth);
        } else if (interval === "Pick Dates") {
            props.setTitle(formatDateString(startDate, endDate));
        }
    }}
            sx={{
                height: interval === "Pick Dates" ? 180 : 150,
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
                <CardContent sx={{display: 'flex', flexDirection: 'column'}}>
                    <FormControl sx={{width: '250', height: '40px'}}>
                        <InputLabel id="demo-simple-select-label" size='small'>Interval</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={interval}
                                onChange={handleIntervalChange}
                                label="Service"     
                                slotProps={{ InputLabel: { size: 'small' } }}
                                style={{height: '40px'}}
                            >
                            <MenuItem value={"This Month"} onClick={() => refreshArrivalsDeparturesForThisMonth(startDate, endDate)}>This Month</MenuItem>
                            <MenuItem value={"Pick Dates"}>Pick Dates</MenuItem>
                        </Select>
                    </FormControl>
                    {interval === "Pick Dates" ? 
                    
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker', 'DatePicker']} >
                                <div style={{ width: '200px' }}>
                                    <DatePicker
                                        label="Start Date" 
                                        value={dayjs(startDate)}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        style={{height: '10px'}}
                                        slotProps={{ textField: { size: 'small' } }}    
                                    />
                                </div>
                                <div style={{ width: '200px' }}>
                                    <DatePicker
                                        label="End Date"
                                        value={dayjs(endDate)}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        style={{height: '10px'}}
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                </div>
                            </DemoContainer>
                        </LocalizationProvider>
                        
                        : <></>
                    }
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: interval === "Pick Dates" ? '15px' : "30px"}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <FlightTakeoffIcon style={{fontSize: '50px', marginRight: '10px', border: '1px ridge', borderRadius: '5px' }}/>
                            <Box sx={{display: 'flex', flexDirection: "column"}}>
                                <Typography variant='h5'>{arrivalsDepartures !== null ? arrivalsDepartures.arrivals.length : 0}</Typography>
                                <Typography>ARRIVALS</Typography>
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <FlightLandIcon style={{fontSize: '50px', marginRight: '10px', border: '1px ridge', borderRadius: '5px'}}/>
                            <Box sx={{display: 'flex', flexDirection: "column"}}>
                                <Typography variant='h5'>{arrivalsDepartures !== null ? arrivalsDepartures.departures.length : 0}</Typography>
                                <Typography>DEPARTURES</Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
    </Card>
  )
}

export default CustomCard