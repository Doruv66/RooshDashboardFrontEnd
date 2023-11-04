import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SideBar from './components/Sidebar'
import routes from './routes'
import { ParkingGarageProvider } from './components/ParkingGarageContext'
import './App.css'

function App() {

  return (
    <>
      <ParkingGarageProvider>
        <Router>
          <SideBar/>
          <Routes>
            {routes.map((route, index) => (
                <Route key={index} path={route.path} element={<route.component />} />
              ))}
          </Routes>
        </Router>
      </ParkingGarageProvider>
    </>
  )
}

export default App