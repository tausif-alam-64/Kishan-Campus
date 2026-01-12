import React from 'react'
import {useAuth} from "../../hooks/useAuth"

const TeacherDashboard = () => {
  const {user} = useAuth();
  
  const actions = [
    {
      title: "Post Notices",
      description: "Create and manage notices for students."
    },
    {
      title : "Upload study material",
      description: "Upload notes, pdfs and assignments."
    },
    {
      title: "Profile",
      description: "Update your personal information."
    }
  ]
  return (
    <div className='min-h-screen bg-gray-50 px-6 pt-24 pb-10'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-(--secondary)'>
          Welcome, {user?.user_metadata?.full_name || "Teacher"}
        </h1>
        <p className='mt-1 text-(--ternary)'>
          Manage your academic activities from here.
        </p>
      </div>

      {/* Action Card */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {actions.map((item) => (
          <div kay={item.title} className='bg-(--secondary) text-white rounded-xl border p-6 hover:shadow-md hover:bg-(--primary) transition'>
            <h3 className='text-lg font-semibold'>{item.title}</h3>
            <p className='mt-2 text-sm text-white'>{item.description}</p>
            <button className='mt-4 text-white font-medium border-2 px-2 py-1 rounded-2xl'>Open</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeacherDashboard
