import React, { useState } from 'react';
import { FaHome, FaClipboardList, FaUsers, FaChartBar, FaCog, FaTasks, FaUserTie } from 'react-icons/fa';
import { DashboardHomeOutlet } from '../../Pages/DashboardHomeOutlet';

export const AdminDashboardHome = () => {
    const [open, setOpen] = useState(false);
    const userData = {
        name: "Admin User",
        email: "admin.user@example.com",
        profilePic: "https://via.placeholder.com/150/FF0000/FFFFFF?text=AU"
    };

    const Links = [
        { name: "Dashboard", icon: <FaHome />, link: "/admin-dashboard" },
        { name: "Manage Complaints", icon: <FaTasks />, link: "/admin-dashboard/manage" },
        { name: "My Workload", icon: <FaUserTie />, link: "/admin-dashboard/workload" },
        { name: "All Complaints", icon: <FaClipboardList />, link: "/admin-dashboard/all-complaints" },
        { name: "User Management", icon: <FaUsers />, link: "/admin-dashboard/management" },
        { name: "Report & Analysis", icon: <FaChartBar />, link: "/admin-dashboard/reports" },
        { name: "Profile Settings", icon: <FaCog />, link: "/admin-dashboard/settings" }
    ];

    return (
        <div>
            <DashboardHomeOutlet
                userData={userData}
                open={open}
                setOpen={setOpen}
                Links={Links}
                name={"Admin Dashboard"}
                small={"AD"}
            />
        </div>
    );
};