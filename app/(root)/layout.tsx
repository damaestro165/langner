
import NavBar from '@/components/NavBar'
import React, { ReactNode } from 'react'

const RootLayout = ({children} : {children : ReactNode}) => {
  return (
    <main className='flex px-24 justify-center items-center flex-col'>
    <NavBar/>
    {children}   
    </main>
  )
}

export default RootLayout