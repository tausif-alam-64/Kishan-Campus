import React from 'react'
import { Link } from 'react-router-dom'
import heroimg from '../../assets/heroimg.avif'
import { supabase } from '../../services/supabase/supabaseClient'

const Hero = () => {
  return (

    <section className='flex flex-col gap-16'>
      <div className='flex flex-col md:flex-row max-w-7xl gap-10 md:gap-34 mx-auto pt-16 px-6 md:px-1'>
        <div className='flex-1'>
          <h1 className='text-4xl md:text-7xl text-primary leading-tight'>Discover Your Education Potential</h1>
        </div>
        <div className='flex-1'>
          <p className=' text-base md:text-2xl text-ternary pb-6'>
            Kisan Intermediate College is a government school committed to quality education, discipline, growth.
          </p>
          <Link to={"/contact"} className="inline-block px-8 md:px-12 py-3 bg-primary text-white font-semibold
                       transition-colors duration-300 hover:opacity-90">Connect With Us</Link>
        </div>
      </div>
      <div className='max-md:h-[35vh] overflow-hidden'>
        <img src={heroimg} alt="" className='w-full h-full object-cover'/>
      </div>
    </section>
  )
}

export default Hero
