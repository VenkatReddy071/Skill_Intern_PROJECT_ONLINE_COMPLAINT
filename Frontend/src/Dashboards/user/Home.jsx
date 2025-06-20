import React, { useState } from 'react';

import { FaHome, FaClipboardList, FaEdit, FaUserCog, FaBars, FaUserCircle } from 'react-icons/fa';
import { DashboardHomeOutlet } from '../../Pages/DashboardHomeOutlet';

export const UserDashboardHome = () => {
  const [open, setOpen] = useState(false);

  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePic: "https://via.placeholder.com/150/007FFF/FFFFFF?text=JD"
  };

  const Links = [
    { name: "Dashboard", icon: <FaHome />, link: "/user-dashboard" },
    { name: "My Complaints", icon: <FaClipboardList />, link: "/user-dashboard/my-complaints" },
    { name: "Submit Complaint", icon: <FaEdit />, link: "/user-dashboard/new-complaint" },
    { name: "Profile Settings", icon: <FaUserCog />, link: "/user-dashboard/settings" }
  ];

  return (
    <div>
      <DashboardHomeOutlet userData={userData} open={open} setOpen={setOpen} Links={Links} name={"User Dashboard"} small={"UD"}/>
    </div>
  );
};