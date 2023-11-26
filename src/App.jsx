import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SideBar from './components/Sidebar'
import NavBar from './components/NavBar'
import routes from './routes'
import { ParkingGarageProvider } from './components/ParkingGarageContext'
import './App.css'
import SignIn from './pages/SignIn'
import AuthAPI from "./api/AuthAPI";
import TokenManager from './api/TokenManager';

function App() {
  const [claims, setClaims] = useState(TokenManager.getClaims());

  const handleLogin = (username, password) => {
    AuthAPI.login(username, password)
      .catch(() => alert("Login failed!"))
      .then(claims => setClaims(claims))
      .catch(error => console.error(error));
  }

  return (
    <>
    {claims ? (
        <Router>
          <NavBar handleDrawerToggle={handleDrawerToggle}/>
          <ParkingGarageProvider>
            <LeftDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={setIsDrawerOpen}/>
            <div className="main-content" style={{ marginLeft: isDrawerOpen ? '5vh' : '0', transition: 'margin-left 0.5s' }}>
              <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={<route.component />} />
                ))}
              </Routes>
            </div>
          </ParkingGarageProvider>
        </Router>
    ) : (
      <SignIn onLogin={handleLogin} />
    )}
    </>
  )
}

export default App;