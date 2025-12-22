import React from "react";
import { NavLink } from "react-router-dom";
import logoHorizontal from "../../assets/logo.png";
import { publicNavLinks } from "../../config/navLinks";

const NavBar = () => {
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
      </nav>
    </header>
  );
};

export default NavBar;
