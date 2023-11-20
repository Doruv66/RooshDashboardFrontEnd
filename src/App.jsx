import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import { ParkingGarageProvider } from './components/ParkingGarageContext';
import './App.css';
import LeftDrawer from "./components/LeftDrawer.jsx";
import NavBar from "./components/NavBar.jsx";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
      <>
        <Router>
          <NavBar handleDrawerToggle={handleDrawerToggle}/>
          <ParkingGarageProvider>
            <LeftDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={setIsDrawerOpen}/>
            <div style={{ marginLeft: isDrawerOpen ? '30vh' : '0', transition: 'margin-left 0.5s' }}>
              <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={<route.component />} />
                ))}
              </Routes>
            </div>
          </ParkingGarageProvider>
        </Router>
      </>
  );
}

export default App;