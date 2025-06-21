import { useState } from 'react'
import io from 'socket.io-client';
import { BrowserRouter as Router,Route,Routes,Outlet } from 'react-router-dom'
import { MainLayout } from './Components/Layouts/MainLayout'
import { MainPage } from './Components/Layouts/MainPage'
import { AboutUs } from './Pages/Aboutus'
import {Login} from "./Components/Login/Login";
import {UserDashboardHome} from "./Dashboards/user/Home"
import { AdminDashboardHome } from './Dashboards/Admin/AdminDashboardHome'
import { AgentDashboardHome } from './Dashboards/Agent/AgentDashboardHome'
import {DashboardType} from "./Pages/DashboardType"
import {UserOverviewPage} from "./Dashboards/user/OverView";
import {AgentOverviewPage} from "./Dashboards/Agent/AgentOverview";
import {AdminOverviewPage}from './Dashboards/Admin/AdminOverview';
import {MyComplaints} from "./Dashboards/user/MyComplaints";
import {NewComplaint} from "./Dashboards/user/NewComplaint";
import { SocketProvider } from './context/ScoketContext.jsx';
function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      <div>
        <Router>
          <SocketProvider>
          <Routes>
            <Route path='/' element={<MainLayout/>}>
              <Route index element={<MainPage/>}/>
              <Route path='/#about-us'element={<AboutUs/>}/>
            </Route>
            <Route path='/login' element={<Login/>}/>
            <Route path='/user-dashboard' element={<UserDashboardHome/>}>
            <Route index element={<UserOverviewPage/>}/>
            <Route path='my-complaints' element={<MyComplaints/>}/>
            <Route path="new-complaint" element={<NewComplaint/>}/>
            </Route>
            <Route path='/admin-dashboard' element={<AdminDashboardHome/>}>
            <Route index element={<AdminOverviewPage/>}/>
            </Route>
            <Route path="/agent-dashboard" element={<AgentDashboardHome/>}>
            <Route index element={<AgentOverviewPage/>}/>
            </Route>
            <Route path="/dashboard-type"element={<DashboardType/>}/>
          </Routes>
          </SocketProvider>
        </Router>
      </div>
    </>
  )
}

export default App
