import DashboardNavBar from '@/components/DashboardNavBar'
import DashboardSideBar from '@/components/DashboardSideBar'
import React, { ReactNode } from 'react'
import StreamVideoProvider from '@/providers/StreamClientProvider'

const RootLayout = ({children} : {children : ReactNode}) => {
  return (
       <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
   
  )
}
export default RootLayout