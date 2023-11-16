import React, { useState } from 'react';
import routes from "../routes";
import { NavLink } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

    return (
      <nav className="navbar">
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
  