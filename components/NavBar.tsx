import Link from 'next/link'
import Image from 'next/image'
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
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";


const NavBar = () => {
  return (
   <section className='w-full'>
    <nav className='flex px-8 py-6 justify-between items-center w-full max-w-7xl mx-auto'>
        <div className='flex items-center gap-10'>
          <Link href='/' className='flex items-center gap-2'>
              <Image src='/icons/logo.svg' alt="Langner" width={32} height={32}/>
              <span className="font-bold text-xl text-gray-900">Langner</span>
          </Link>
          
          <div className='hidden lg:flex items-center gap-8'>
            <Link href='/previous' className="text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1">Lessons</Link>
            <Link href='#' className="text-gray-500 hover:text-gray-900 font-medium">Tutors</Link> 
            <Link href='#' className="text-gray-500 hover:text-gray-900 font-medium">Pricing</Link>  
            <Link href='#' className="text-gray-500 hover:text-gray-900 font-medium">About</Link>   
          </div>
        </div>

        <div className='flex items-center gap-5'>
          <LoginLink>
            <Button variant='ghost' className='text-gray-600 font-bold hover:bg-transparent hover:text-emerald-600'>Login</Button>
          </LoginLink>
          <RegisterLink>
            <Button className='bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 font-bold shadow-lg shadow-emerald-600/20'>Get Started</Button>
          </RegisterLink>
        </div>
    </nav>
    <nav className='flex p-4 justify-between  lg:hidden '>
      <div className='w-1/2 text-xl flex items-center font-bold' >
            Langner
      </div>
     <div>
       <Sheet>
          <SheetTrigger> 
            {/* <Button variant="outline" size="icon">
              < HamburgerMenuIcon className="h-4 w-4" />
            </Button> */}
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