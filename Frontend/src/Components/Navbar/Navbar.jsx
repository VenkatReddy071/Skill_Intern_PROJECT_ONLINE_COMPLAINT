
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TiThMenu } from "react-icons/ti";
import { MdClose } from "react-icons/md";
import { MainPage } from '../Layouts/MainPage';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "#about-us" },
    { name: "Features", path: "#features" },
    { name: "How It Works", path: "#how-it-works" },
  ];

  const location = useLocation();
  const [active, setActive] = useState(() => {
    const currentPath = location.pathname;
    const currentHash = location.hash.replace('#', '');

    const routeMatch = navLinks.find(link => link.type === "route" && link.path === currentPath);
    if (routeMatch) {
      return routeMatch.name;
    }

    if (currentPath === '/' && currentHash) {
      const foundLink = navLinks.find(link => link.type === "scroll" && link.path.replace('#', '') === currentHash);
      return foundLink ? foundLink.name : "Home";
    }

    return "Home";
  });

  const handleNavLinkClick = (itemName, itemPath, type) => {
    setActive(itemName);
    setIsOpen(false);

    if (type === "scroll") {
      const targetId = itemPath.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        if (location.pathname !== '/') {
          navigate(`/${itemPath}`);
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else if (type === "route") {
      navigate(itemPath);
    }
  };

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='px-4 py-2 fixed w-full top-0 bg-white shadow-sm text-black z-20'>
      <div className='flex justify-between items-center container mx-auto'>
        <div className="flex items-center mb-4 md:mb-0">
          <svg className="w-12 h-12  text-[#007FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
         <h1 className='px-2 py-2 text-[#007FFF] text-2xl md:text-2xl lg:text-3xl font-extrabold tracking-tight'>ResolveFlow</h1>
        </div>
        
        
        <nav className='hidden md:block'>
          <ul className='flex gap-6 px-2'>
            {navLinks.map((item, index) => (
              <li
                key={index}
                className={`font-semibold cursor-pointer text-lg
                  ${active === item.name ? "bg-[#007FFF] text-white px-3 py-1 rounded-full" : "text-gray-700"}
                  transition-colors duration-300`}
              >
                <Link
                  to={item.path}
                  onClick={(e) => {
                    if (item.type === "scroll" && location.pathname === '/') {
                      e.preventDefault();
                    }
                    handleNavLinkClick(item.name, item.path, item.type);
                  }}
                  className="block px-1 py-1"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <Link to="/login" className='bg-[#007FFF] text-white px-6 py-1 rounded-full text-xl ml-4'>Login</Link>
          </ul>
        </nav>

        <div className="md:hidden">
          <button className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007FFF] p-2 rounded-md" onClick={handleToggleMenu}>
            <TiThMenu className="w-8 h-8 text-[#007FFF]"/>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          transition-opacity duration-300 ease-in-out`}
        onClick={handleToggleMenu}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-4">
          <button className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007FFF] p-2 rounded-md" onClick={handleToggleMenu}>
            <MdClose className="w-8 h-8 text-[#007FFF]"/>
          </button>
        </div>
        <nav className='block px-2'>
          <ul className='flex flex-col gap-6 items-center'>
            {navLinks.map((item, index) => (
              <li
                key={index}
                className={`font-semibold cursor-pointer text-lg w-full text-center py-2 rounded-full
                  ${active === item.name ? "bg-[#007FFF] text-white" : "text-gray-700"}
                  transition-colors duration-300`}
              >
                <Link
                  to={item.path}
                  onClick={(e) => {
                    if (item.type === "scroll" && location.pathname === '/') {
                      e.preventDefault();
                    }
                    handleNavLinkClick(item.name, item.path, item.type);
                  }}
                  className="block px-1 py-1"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <Link to="/login" className='bg-[#007FFF] text-white px-6 py-2 rounded-full text-xl mt-4'>Login</Link>
          </ul>
        </nav>
      </div>

     
    </div>
  );
};
