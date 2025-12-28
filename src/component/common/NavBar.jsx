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
          <button onClick={toggleMenu} className="focus:outline-none" aria-label="Toggle Menu">
            <RxHamburgerMenu size={30}/>
          </button>
        </div>
      </nav>

      {
        isOpen && (
          <ul className="md:hidden flex flex-col bg-white border-">
          {publicNavLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block font-medium text-gray-700 ${
                    isActive ? "text-white bg-(--secondary)" : "bg-white hover:text-(--secondary) text-(--primary)"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        )
      }
    </header>
  );
};

export default NavBar;
