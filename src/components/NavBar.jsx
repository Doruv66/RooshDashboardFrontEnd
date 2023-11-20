import React, { useState } from 'react';
import routes from "../routes";
import { NavLink } from 'react-router-dom';
import './NavBar.css';
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

function NavBar({ handleDrawerToggle }) {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

    return (
      <nav className="navbar">
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <img src="/roosh-logoversion-8.png" className={"RooshLogo"}/>
          <h1>Roosh Provider Dashboard</h1>
        {/* {routes.map(link => (
            <li key={link.id}>
              <NavLink to={link.path} className="top-nav-link">{link.text}</NavLink>
            </li>
          ))} */}
      </nav>
    );
  }
  export default NavBar;
  