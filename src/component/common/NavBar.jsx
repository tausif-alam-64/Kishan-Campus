import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logoHorizontal from "../../assets/logo.png";
import { publicNavLinks } from "../../config/navLinks";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { useAuth } from "../../hooks/useAuth";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const {user, userRole} = useAuth();
  console.log({user, userRole})
  return (
    <header className="w-full sticky bg-white top-0 z-50">
      <nav className="flex items-center justify-between px-6 max-sm:px-2 py-4 max-sm:py-3 mx-auto max-w-7xl">
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
                    isActive
                      ? "text-(--primary) border-b-2 "
                      : "bg-white hover:text-(--secondary) text-(--primary)"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li></li>
        </ul>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none border-2 border-gray-300 rounded-md p-1 hover:bg-gray-50 transition-colors"
            aria-label="Toggle Menu"
          >
            <RxHamburgerMenu size={25} className="w-8 text-gray-500" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-block/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-screen w-56 mt-2 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* close button */}
        <div className="flex justify-end p-4 border-b">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
            className="text-(--secondary) hover:text-(--primary) border border-gray-400 rounded-md hover:bg-gray-50 transition"
          >
            <RxCross2 size={35} className="w-9 text-gray-500" />
          </button>
        </div>

        {/* Menu Links */}
        <ul className="flex flex-col">
          {publicNavLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-4 font-medium ${
                    isActive
                      ? "bg-(--secondary) text-white"
                      : "text-(--primary) hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default NavBar;
