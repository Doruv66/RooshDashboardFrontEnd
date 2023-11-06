import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SideBar from './components/Sidebar'
import NavBar from './components/NavBar'
import routes from './routes'
import { ParkingGarageProvider } from './components/ParkingGarageContext'
import './App.css'

function App() {

  return (
    <>
        <Router>
          <NavBar/>
          <ParkingGarageProvider>
            <SideBar/>
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