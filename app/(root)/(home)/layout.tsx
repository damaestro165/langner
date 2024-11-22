import NavBar from '@/components/NavBar'
import React, { ReactNode } from 'react'

const HomeLayout = ({children} : {children : ReactNode}) => {
  return (
    <main className='flex justify-center items-center flex-col'>
    <NavBar/>
    {children}   
    </main>
  )
}

export default HomeLayout