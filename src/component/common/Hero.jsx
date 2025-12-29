import React from 'react'
import { Link } from 'react-router-dom'
import heroimg from '../../assets/heroimg.png'

const Hero = () => {
  return (
    <section className='w-full bg-gray-50 pt-24 pb-16'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6'>
        {/* left text */}
        <div className='flex-1 text-center md:text-left'>
          <h1 className='text-4xl md:text-5xl font-bold text-(--primary) leading-tight'>
            Welcom to <span className='text-(--secondary) font-extrabold'>Kishan Intermediate collage</span>
          </h1>
          <p className='mt-4 text-(--ternary) text-lg'>
            A digital campus for students, teachers and parents - learn, connect & grow together.
          </p>
           {/* cta button */}
          <div className='mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-3'>
            <Link to={"/admission"} className="px-6 py-3 bg-(--secondary) text-white rounded-lg font-semibold hover:bg-(--primary) transition">Apply For Admission</Link>
            <Link to={"/contact"} className="px-6 py-3 bg-white  border border-(--secondary) text-(--primary) rounded-lg font-semibold hover:bg-(--primary) hover:text-white transition" >Contact School</Link>
          </div>
        </div>
        <div>
          <img src={heroimg} alt="campus illustration" className='w-full max-w-md mx-auto'  />
        </div>
      </div>
    </section>
  )
}

export default Hero
