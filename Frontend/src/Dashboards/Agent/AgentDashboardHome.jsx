import React, { useState } from 'react';
import { FaHome, FaClipboardList, FaUserCog,FaChartBar, FaTasks, FaChartLine, FaUsers, FaTicketAlt } from 'react-icons/fa';
import { DashboardHomeOutlet } from '../../Pages/DashboardHomeOutlet';

export const AgentDashboardHome = () => {
    const [open, setOpen] = useState(false);
    const userData = {
        name: "Agent Smith",
        email: "agent.smith@example.com",
        profilePic: "https://via.placeholder.com/150/00AAFF/FFFFFF?text=AS"
    };

    const Links = [
        { name: "Dashboard", icon: <FaHome />, link: "/agent-dashboard" },
        { name: "My Complaints", icon: <FaTicketAlt />, link: "/agent-dashboard/my-complaints" },
        { name: "Manage Complaints", icon: <FaTasks />, link: "/agent-dashboard/manage-complaints" },
        { name: "Customer Information", icon: <FaUsers />, link: "/agent-dashboard/customers" },
        { name: "My Workload", icon: <FaChartLine />, link: "/agent-dashboard/performance" },
        { name: "Report & Analysis", icon: <FaChartBar />, link: "/agent-dashboard/reports" },
        { name: "Profile Settings", icon: <FaUserCog />, link: "/agent-dashboard/settings" }
    ];

    return (
        <div>
            <DashboardHomeOutlet
                userData={userData}
                open={open}
                setOpen={setOpen}
                Links={Links}
                name={"Agent Dashboard"}
                small={"AD"}
            />
        </div>
    );
};