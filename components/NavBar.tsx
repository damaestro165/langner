import Link from 'next/link'
import React from 'react'
import { Button } from "@/components/ui/button"


const NavBar = () => {
  return (
    <nav className='flex py-5 justify-center items-center w-full'>
        <div className=' w-1/5'>
            Langner
        </div>
         <div className='flex justify-center items-center gap-3 w-2/5 '>
          <Button variant='link'><Link href='/'>Home</Link></Button>
          <Button variant='link'><Link href='/'>About Us</Link></Button> 
          <Button variant='link'><Link href='/'>How it works</Link></Button>  
          <Button variant='link'><Link href='/'>Features</Link></Button>   
        </div>
         <div className=' flex justify-end gap-5 w-2/5'>
            <Button className=' bg-green-800 w-32'>Get Started</Button>
            <Button variant='outline' className=' border border-green-800 w-32'>Log In</Button>
        </div>
    </nav>
  )
}

export default NavBar