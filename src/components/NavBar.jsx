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
          <button onClick={toggleDropdown} className="sidebar-toggle">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Hamburger_icon.svg" alt="Menu" />
          </button>
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
  