import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { NavLink } from 'react-router-dom'

function Sidebar() {

  const {isEducator}=useContext(AppContext)

  const menuItems= [
   { name:"DashBoard", path:"/educator", icon:assets.home_icon},
   { name:"Add Course", path:"/educator/addCourse", icon:assets.add_icon},
   { name:"My courses", path:"/educator/myCourses", icon:assets.my_course_icon},
   { name:"Student Enrolled", path:"/educator/studentsEnrolled", icon:assets.person_tick_icon}
  ]

  return isEducator&&(
    <div className='nd:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>

      {menuItems.map((item)=>(
        <NavLink className={({isActive})=>`flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive?"bg-indigo-50 border-r-[6px] border-indigo-500/90 ":'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`} to={item.path} key={item.name} end={item.path==="/educator"}>
  
          <img src={item.icon} className='w-6 h-6'></img>
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
