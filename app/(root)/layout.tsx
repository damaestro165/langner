import React, { ReactNode } from 'react'
import { Toaster } from "@/components/ui/toaster"
import '@stream-io/video-react-sdk/dist/css/styles.css';
import "react-datepicker/dist/react-datepicker.css";

const RootLayout = ({children} : {children : ReactNode}) => {
  return (
    <main>
         {children} 
         <Toaster/> 
    </main>
  )
}

export default RootLayout