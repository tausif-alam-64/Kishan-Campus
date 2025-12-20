import React from 'react'
import { NavLink } from 'react-router-dom'
import logoHorizontal from "../../assets/logo.png"
import { publicNavLinks } from '../../config/navLinks'

const NavBar = () => {
  return (
    <header className='w-full border-b bg-oklch(0.99 0 0)'>
        <nav>
            <NavLink to="/">
                <img src={logoHorizontal} alt="logo" className='h-20' />
            </NavLink>
            <ul>
                {
                    publicNavLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink to={link.path} >{link.label}</NavLink>
                        </li>
                    ))
                }
            </ul>
        </nav>
    </header>
  )
}

export default NavBar
