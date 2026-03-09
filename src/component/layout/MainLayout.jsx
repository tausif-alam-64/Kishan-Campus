import React from 'react'
import NavBar from '../common/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from '../common/Footer'
import WhatsAppButton from '../common/WhatsAppButton'
import ScrollToTop from '../common/ScrollToTop'

const MainLayout = () => {
  return (
    <>
    <ScrollToTop />
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
