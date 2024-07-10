import Link from 'next/link'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HamburgerMenuIcon } from '@radix-ui/react-icons'



const NavBar = () => {
  return (
   <section className='w-full'>
     <nav className=' hidden lg:flex py-5 justify-center items-center w-full'>
        <div className='flex justify-center w-1/5 '>
            Langner
        </div>
         <div className='flex  justify-center items-center w-2/5 '>
          <Button variant='link'><Link href='/'>Home</Link></Button>
          <Button variant='link'><Link href='/'>About Us</Link></Button> 
          <Button variant='link'><Link href='/'>How it works</Link></Button>  
          <Button variant='link'><Link href='/'>Features</Link></Button>   
        </div>
         <div className=' flex justify-center gap-4 w-2/5'>
            <Button className=' bg-green-700 w-36'>Get Started</Button>
            <Button variant='outline' className=' border border-green-700 w-36'>Log In</Button>
        </div>
    </nav>
    <nav className='flex p-4 justify-between  lg:hidden '>
      <div className='w-1/2 text-xl flex items-center font-bold' >
            Langner
      </div>
     <div>
       <Sheet>
          <SheetTrigger> 
            <Button variant="outline" size="icon">
              < HamburgerMenuIcon className="h-4 w-4" />
            </Button>
    </SheetTrigger>
          <SheetContent>
           <div className='w-1/2 text-xl font-bold' >Langner</div>
          </SheetContent>
        </Sheet>
     </div>


    </nav>
   </section>
  )
}

export default NavBar