import React from 'react'
import NavBar from '../common/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from '../common/Footer'
import WhatsAppButton from '../common/WhatsAppButton'

const MainLayout = () => {
  return (
    <>
    <NavBar />
    <main className='min-h-screen'>
        <Outlet />
    </main>
    <Footer />
    <WhatsAppButton />
    </>
  )
}

export default MainLayout
