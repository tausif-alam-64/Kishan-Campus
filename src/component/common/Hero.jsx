import React from 'react'
import { Link } from 'react-router-dom'
import heroimg from '../../assets/heroimg.avif'
import { supabase } from '../../services/supabase/supabaseClient'

const Hero = () => {
  return (

    <section className='flex flex-col gap-16'>
      <div className='flex max-w-7xl gap-34 mx-auto pt-16'>
        <div className='flex-1'>
          <h1 className='text-7xl text-primary'>Discover Your Education Potential</h1>
        </div>
        <div className='flex-1'>
          <p className='text-2xl text-ternary pb-8'>
            Our school provides dynamic environment that empowers students to new heights.
          </p>
          <Link to={"/contact"} className="inline-block px-12 py-3 bg-primary text-white font-semibold
                       transition-colors duration-300 hover:opacity-90">Contact School</Link>
        </div>
      </div>
      <div>
        <img src={heroimg} alt="" className='w-full h-auto object-cover'/>
      </div>
    </section>
  )
}

export default Hero
