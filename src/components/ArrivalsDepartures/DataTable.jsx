import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Divider, Typography } from '@mui/material';

const DataTable = ({bookings}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
    
        return date.toLocaleDateString(undefined, options);
    };
    return (
        <>
            {
                bookings.length > 0 ? ( 
                    <TableContainer component={Paper} sx={{marginTop: '40px'}}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Garage</TableCell>
                                    <TableCell align="right">Airport</TableCell>
                                    <TableCell align="right">License Plate</TableCell>
                                    <TableCell align="right">Start Date</TableCell>
                                    <TableCell align="right">End Date</TableCell>
                                    <TableCell align="right">Service Type</TableCell>
                                </TableRow>
                            </TableHead>
                        <TableBody>
                            {bookings.map((booking) => (
                            <TableRow
                                key={booking.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                {booking.customer.name}
                                </TableCell>
                                <TableCell align="right">{booking.garage.name}</TableCell>
                                <TableCell align="right">{booking.garage.airport}</TableCell>
                                <TableCell align="right">{booking.car.licensePlate}</TableCell>
                                <TableCell align="right">{formatDate(booking.startDate)}</TableCell>
                                <TableCell align="right">{formatDate(booking.endDate)}</TableCell>
                                <TableCell align="right">{booking.service.serviceType}</TableCell>
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