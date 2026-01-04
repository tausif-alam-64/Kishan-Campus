import React from 'react'

const AuthCard = ({title, children}) => {
  return (
    <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-md'>
      <h2 className='text-2xl font-bold text-center text-(--primary) mb-6'>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default AuthCard
