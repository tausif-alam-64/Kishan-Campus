import React from 'react'

const Header = ({mainImg, heading, subHeading}) => {
  return (
    <main>
        {/* Hero Image */}
        <section className='max-md:h-[27vh] overflow-hidden w-full'>
            <img src={mainImg} alt="Main Image" className='block w-full h-full object-cover rounded-[inharit]'/>
        </section>
         {/* Overlay block */}
        <section className='relative'>
            <div className='max-w-7xl mx-auto px-8 md:px-0'>
                <div className='bg-primary text-white px-6 py-8 md:px-16 md:py-19 -mt-20 md:-mt-32 max-w-2xl'>
                    <p className='tracking-widest uppercase text-md leading-tight md:pb-2'>
                        {heading}
                    </p>
                    <h1 className='mt-3 text-3xl md:text-5xl font-semibold'>
                        {subHeading}
                    </h1>
                </div>
            </div>
        </section>
    </main>
  )
}


export default Header
