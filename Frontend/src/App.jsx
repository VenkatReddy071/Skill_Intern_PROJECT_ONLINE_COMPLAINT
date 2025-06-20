import { useState } from 'react'
import { BrowserRouter as Router,Route,Routes,Outlet } from 'react-router-dom'
import { MainLayout } from './Components/Layouts/MainLayout'
import { MainPage } from './Components/Layouts/MainPage'
import { AboutUs } from './Pages/Aboutus'
import {Login} from "./Components/Login/Login";
import {UserDashboardHome} from "./Dashboards/user/Home"
import { AdminDashboardHome } from './Dashboards/Admin/AdminDashboardHome'
import { AgentDashboardHome } from './Dashboards/Agent/AgentDashboardHome'
import {DashboardType} from "./Pages/DashboardType"
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
            <Route path='/user-dashboard' element={<UserDashboardHome/>}>
            </Route>
            <Route path='/admin-dashboard' element={<AdminDashboardHome/>}>
            </Route>
            <Route path="/agent-dashboard" element={<AgentDashboardHome/>}>
            </Route>
            <Route path="/dashboard-type"element={<DashboardType/>}/>
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
