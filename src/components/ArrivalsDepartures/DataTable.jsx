import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'; 
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Divider, Typography } from '@mui/material';

const DataTable = ({bookings, option}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
        return formattedDate;
    };
    
    const formatHour = (dateString) => {
        const date = new Date(dateString);
        const formattedHour = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return formattedHour;
    };
    return (
        <>
            {
                bookings.length > 0 ? ( 
                    <TableContainer component={Paper} sx={{marginTop: '40px'}}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Reference</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Flight Nr.</TableCell>
                                    <TableCell>License Plate</TableCell>
                                    <TableCell>Car</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Country</TableCell>
                                </TableRow>
                            </TableHead>
                        <TableBody>
                            {bookings.map((booking) => (
                            <TableRow
                                key={booking.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                R324312412
                                </TableCell>
                                <TableCell align="right">{option ? formatDate(booking.startDate) : formatDate(booking.endDate)}</TableCell>
                                <TableCell align="right">{option ? formatHour(booking.startDate) : formatHour(booking.endDate)}</TableCell>
                                <TableCell align="right">{option ? <FlightTakeoffIcon style={{fontSize: "35px", color: '#DA4A0C'}}/> : <FlightLandIcon style={{fontSize: "35px", color: '#DA4A0C'}}/>}</TableCell>
                                <TableCell align="right">{booking.customer.name}</TableCell>
                                <TableCell align="right">{booking.customer.email}</TableCell>
                                <TableCell align="right">{option ? booking.flightNumberDeparture : booking.flightNumberArrival}</TableCell>
                                <TableCell align="right">{booking.car.licensePlate}</TableCell>
                                <TableCell align="right">{booking.car.model}</TableCell>
                                <TableCell align="right">€ 55.00</TableCell>
                                <TableCell align="right">NL</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <>
                        <Divider variant='middle' sx={{marginTop: '20px'}}/>
                        <Typography variant='h6' sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px'}}>Nothing Available</Typography>
                    </>
                )
            }
    </>
    )
}

export default DataTable