import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import GarageIcon from '@mui/icons-material/Garage';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import BarChartIcon from '@mui/icons-material/BarChart';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import './LeftDrawer.css';
import {FormControl, InputLabel, ListItemText, MenuItem, Select} from "@mui/material";
import {NavLink} from "react-router-dom";
import routes from "../routes.jsx";
import ParkingGarageItemList from "./ParkingGarageItemList.jsx";
import { ParkingGarageContext } from './ParkingGarageContext';
import {useContext} from "react";


export default function LeftDrawer() {
    const { parkingGarages } = useContext(ParkingGarageContext);
    const getIcon = (text) => {
        switch (text) {
            case "Garage details": return <GarageIcon />;
            case "Departures and Arrivals": return <AirplaneTicketIcon />;
            case "Statistics": return <BarChartIcon />;
            case "Booking History": return <LibraryBooksIcon />;
            default: return null;
        }
    }

    const navLinks = routes.filter(route => route.isNavLink);
    const list = (anchor) => (
        <Box
            sx={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250}}
            role="presentation"
        >
            <List>
                <FormControl fullWidth>
                    <InputLabel id="garage-select-label">Garage:</InputLabel>
                    <Select
                        labelId="garage-select-label"
                        id="garage-select"
                        value={garage}
                        label="Garage"
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                <div className="dropdown-menu">
                    <ParkingGarageItemList/>
                </div>
                {navLinks.map((route) => (
                    <ListItem key={route.text} disablePadding>
                        <NavLink
                            to={route.path}
                            className={({isActive}) => isActive ? "drawer-link active-drawer-link" : "drawer-link"}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    {getIcon(route.text)}
                                </ListItemIcon>
                                <ListItemText primary={route.text}/>
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                ))}
            </List>
            <Divider/>
        </Box>
    );

    return (
        <div>
            <Drawer
                anchor="left"
                open={true}
                variant="permanent"
                className="drawer-below-navbar"
            >
                {list("left")}
            </Drawer>
        </div>
    );
}