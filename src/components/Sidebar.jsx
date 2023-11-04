import React, { useState } from 'react';
import routes from "../routes";
import { NavLink } from 'react-router-dom';
import ParkingGarageItemList from './ParkingGarageItemList';

function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

    return (
      <nav className="sidebar">
        <li>
          <button onClick={toggleDropdown} className="dropdown-toggle">
            Parking Garage
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <ParkingGarageItemList />
            </div>
          )}
        </li>

        {routes.map(link => (
            <li key={link.id}>
              <NavLink to={link.path} className="nav-link">{link.text}</NavLink>
            </li>
          ))}
      </nav>
    );
  }
  export default Sidebar;
  