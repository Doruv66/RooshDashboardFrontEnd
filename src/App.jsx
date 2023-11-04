import { Router, Routes, BrowserRouter as Router } from 'react-router-dom'
import routes from './routes'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          {routes.map((route, index) => (
              <Route key={index} path={route.path} element={<route.component />} />
            ))}
        </Routes>
      </Router>
    </>
  )
}

export default App