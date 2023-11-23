import React from 'react';
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
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import { NavLink } from "react-router-dom";
import routes from "../routes.jsx";
import ParkingGarageMenu from "./ParkingGarageMenu.jsx";
import './LeftDrawer.css';
import {ListItemText} from "@mui/material";
import {useParkingGarage} from "./ParkingGarageContext.jsx";

const LeftDrawer = ({ isDrawerOpen }) => {
    const { setIsNewParkingGarage, isNewParkingGarage } = useParkingGarage();
    const handleAddGarageClick = () => {
        setIsNewParkingGarage(true);
    };

    const handleGarageDetailsClick = () => {
        setIsNewParkingGarage(false);
    }
    const handleNavLinkClick = (text) => {

        if (text === "Add Garage") {
            handleAddGarageClick();
        } else if (text === "Garage Details") {
            handleGarageDetailsClick();
        }
    };
    const getIcon = (text) => {
        switch (text) {
            case "Add garage": return <LocalParkingIcon/>
            case "Garage details": return <GarageIcon />;
            case "Departures and Arrivals": return <AirplaneTicketIcon />;
            case "Statistics": return <BarChartIcon />;
            case "Booking History": return <LibraryBooksIcon />;
            default: return null;
        }
    }

    const navLinks = routes.filter(route => route.isNavLink);
    const list = () => (
        <div role="presentation">
            <List>
                <ParkingGarageMenu />
                {navLinks.map((route) => (
                    <ListItem key={route.text} disablePadding>
                        <NavLink
                            to={route.path}
                            className={({ isActive }) => isActive ? "drawer-link active-drawer-link" : "drawer-link"}
                            onClick={(event) => handleNavLinkClick(route.text)}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    {getIcon(route.text)}
                                </ListItemIcon>
                                <ListItemText primary={route.text} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </div>
    );

    return (
        <Drawer
            anchor="left"
            open={isDrawerOpen}
            variant="persistent"
            className="drawer-below-navbar"
        >
            {list()}
        </Drawer>
    );
}

export default LeftDrawer;