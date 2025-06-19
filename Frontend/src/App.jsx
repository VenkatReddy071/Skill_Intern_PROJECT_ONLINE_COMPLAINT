import { useState } from 'react'
import { BrowserRouter as Router,Route,Routes,Outlet } from 'react-router-dom'
import { MainLayout } from './Components/Layouts/MainLayout'
import { MainPage } from './Components/Layouts/MainPage'
import { AboutUs } from './Pages/Aboutus'
import {Login} from "./Components/Login/Login";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path='/' element={<MainLayout/>}>
              <Route index element={<MainPage/>}/>
              <Route path='/#about-us'element={<AboutUs/>}/>
            </Route>
            <Route path='/login' element={<Login/>}/>
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
