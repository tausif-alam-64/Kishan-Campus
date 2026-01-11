import React from 'react'
import { useAuth } from '../../hooks/useAuth'

const StudentDashboard = () => {

    const {user} = useAuth();
  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold'>
        Welcome, {user?.user_metadata?.full_name || "Student"}
      </h1>
      <p className='mt-2 text-gray-600'>
        This is your student Dashboard.
      </p>
    </div>
  )
}

export default StudentDashboard
