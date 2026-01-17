import React from 'react'
import {useAuth} from "../../hooks/useAuth"
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const stats = [
    { label: "Total Students", value: 120 },
    { label: "Active Notices", value: 5 },
    { label: "Study Materials", value: 18 },
  ];
  
  const actions = [
    {
      title: "Post Notices",
      description: "Create and manage notices for students.",
      path: "/teacher/notices",
    },
    {
      title : "Upload study material",
      description: "Upload notes, pdfs and assignments.",
       path: "/teacher/uploads",
    },
    {
      title: "Profile",
      description: "Update your personal information.",
      path: "/teacher/profile",
    }
  ]
  return (
    <div className='min-h-screen bg-gray-50 px-6 pt-24 pb-10'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-secondary'>
          Welcome, {user?.user_metadata?.full_name || "Teacher"}
        </h1>
        <p className='mt-1 text-ternary'>
          Manage your academic activities from here.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10'>
        {stats.map((item) => (
          <div key={item.label} className='bg-white border rounded-xl p-5 text-center border-primary'>
            <p className='text-2xl font-bold text-primary'>
              {item.value}
            </p>
            <p className='mt-1 text-sm text-ternary'>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Action Card */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {actions.map((item) => (
          <div kay={item.title} onClick={() => navigate(item.path)} className='bg-secondary text-white rounded-xl border p-6 hover:shadow-md hover:bg-primary transition'>
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
