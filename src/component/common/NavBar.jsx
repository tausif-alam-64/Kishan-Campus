import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logoHorizontal from "../../assets/logo.png";
import { publicNavLinks } from "../../config/navLinks";
import { RxHamburgerMenu } from "react-icons/rx";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)
  return (
    <header className="w-full sticky bg-white top-0 z-50">
      <nav className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <NavLink to="/">
          <img
            src={logoHorizontal}
            alt="logo"
            className="h-16 transition-transform duration-300 hover:scale-105"
          />
        </NavLink>
        <ul className="hidden md:flex space-x-6">
          {publicNavLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 font-medium  ${
                    isActive ? "text-(--primary) border-b-2 " : "bg-white hover:text-(--secondary) text-(--primary)"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Movile hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none border-2 border-gray-300 rounded-lg p-1 hover:bg-gray-50 transition-colors" aria-label="Toggle Menu">
            <RxHamburgerMenu size={30} className="w-11 text-gray-500"/>
          </button>
        </div>
      </nav>

      {
        isOpen && (
          <ul className="md:hidden flex flex-col bg-white">
          {publicNavLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block font-medium ${
                    isActive ? "text-white bg-(--secondary)" : "bg-white hover:text-(--secondary) text-(--primary)"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>

          ))}
          <li>
    <NavLink
      to="/login"
      className="block font-medium bg-white hover:text-(--secondary) text-(--primary)"
    >
      Login
    </NavLink>
  </li>
        </ul>
        )
      }
    </header>
  );
};

export default NavBar;
