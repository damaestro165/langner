'use client'
import Image from 'next/image'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Icon from "./DynamicIcon"
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'


const DashboardNavBar = () => {
   const pathname = usePathname()
  const { user } = useKindeBrowserClient();
  console.log(user);
  return (
    <>
    <nav className='fixed hidden md:flex justify-end z-5 w-full px-6 py-2 lg:px-5 bg-white h-fit border-b-[1px] border-b-gray-200  '>
        <div className='flex gap-2 items-center justify-center'>
        <p className='font-semibold text-sm'>{user.given_name} {user.family_name}</p>
        <Avatar>
              <AvatarImage src={user.picture} />
              <AvatarFallback>{user.given_name.charAt(0)}{user.family_name.charAt()}</AvatarFallback>
        </Avatar>
        </div>
    </nav>
    <nav className='flex md:hidden p-3 bg-green-800 w-screen justify-between'>
      <Image src='./icons/logo.svg' alt="Langner" width={24} height={24} className='w-10 '/>
      <Sheet>
        <SheetTrigger>
           <Icon name='Menu' color='white' /> 
        </SheetTrigger>
        <SheetContent className="flex flex-col h-full">
            {sidebarLinks.map((link) => {
                const isActive = pathname === link.route || pathname.startsWith(link.route);
                return (
                        <Link 
                        href={link.route}
                        key={link.label}
                        className={cn('flex gap-3 items-center py-4 px-2 gap  justify-start text-center text-gray-400 ', {'bg-green-100 border-b-2 border-b-green-700 text-green-700 ': isActive})}
                        >
                        <Icon name= {link.icon} /> 
                        <p>{link.label}</p>
                        </Link>
                )
                    
            })}
        </SheetContent>
      </Sheet>


    </nav>
    </>
  )
}

export default DashboardNavBar