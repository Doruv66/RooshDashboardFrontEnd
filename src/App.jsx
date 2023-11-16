import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes'
import { ParkingGarageProvider } from './components/ParkingGarageContext'
import './App.css'
import LeftDrawer from "./components/LeftDrawer.jsx";
import CustomSeparator from "./components/CustomSeparator.jsx";
import NavBar from "./components/NavBar.jsx";

function App() {

  return (
    <>
        <Router>
          <NavBar/>
          <ParkingGarageProvider>
            <LeftDrawer/>
            <Routes>
              {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={<route.component />} />
                ))}
            </Routes>
          </ParkingGarageProvider>
        </Router>
    </>
  )
}

export default App