import React, { ReactNode } from 'react'
import { Toaster } from "@/components/ui/toaster"

const RootLayout = ({children} : {children : ReactNode}) => {
  return (
    <main>
         {children} 
         <Toaster/> 
    </main>
  )
}

export default RootLayout