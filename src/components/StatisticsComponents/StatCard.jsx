import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material';

const StatCard = (props) => {
  return (
    <Card 
        sx={{
            height: 80,
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
                <Typography variant="h8" fontSize={12} fontWeight={500} letterSpacing={2}>
                {props.title}
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px'}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Box sx={{display: 'flex'}}>
                            <Typography variant="h6" >
                                {props.title === 'ORDERS' ? props.number : `€ ${props.number}`}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Box sx={{display: 'flex', flexDirection: "column"}}>
                            <Typography variant="h8" fontSize={15}>
                             {props.title === 'ORDERS' ? `(${props.number})` : `(€ ${props.number})`} 
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
    </Card>
  )
}

export default StatCard