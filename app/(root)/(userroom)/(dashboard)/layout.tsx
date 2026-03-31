import DashboardSideBar from '@/components/DashboardSideBar'
import React, { ReactNode } from 'react'
import StreamVideoProvider from '@/providers/StreamClientProvider'

const RootLayout = ({children} : {children : ReactNode}) => {
  return (
       
          <main className='flex w-screen h-full'>
            <DashboardSideBar/>
            <section className='flex flex-col w-full min-h-screen bg-background'>
              <div className='flex flex-col flex-1 md:ml-64 px-4 lg:px-12'>
              <div className='h-full w-full py-8'>
              {children}
              </div>
              </div>
            </section>
          </main>
   
  )
}

export default RootLayout