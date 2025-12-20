import React from 'react'
import NavBar from '../common/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from '../common/Footer'

const MainLayout = () => {
  return (
    <>
    <NavBar />
    <main className='min-h-screen'>
        <Outlet />
    </main>
    <Footer />
    </>
  )
}

export default MainLayout
