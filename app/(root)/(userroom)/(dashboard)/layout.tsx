import DashboardNavBar from '@/components/DashboardNavBar'
import DashboardSideBar from '@/components/DashboardSideBar'
import React, { ReactNode } from 'react'
import StreamVideoProvider from '@/providers/StreamClientProvider'

const RootLayout = ({children} : {children : ReactNode}) => {
  return (
       <StreamVideoProvider>
          <main className='flex w-screen h-full'>
            <DashboardSideBar/>
            <section className='flex flex-col w-full h-screen'>
              <DashboardNavBar/>
              <div className='flex pt-5 flex-1 md:ml-14 flex-col px-3 md:pt-[4rem] h-full lg:px-8'>
              <div className='h-full w-full md:p-8 lg:p-0'>
              {children}
              </div>
              </div>
            </section>
          </main>
      </StreamVideoProvider>
   
  )
}

export default RootLayout