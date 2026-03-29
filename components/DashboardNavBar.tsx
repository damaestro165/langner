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
    <nav className='fixed top-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-8 h-20 transition-all duration-200' style={{ left: '16rem' }}>
        <div className='flex items-center gap-12'>
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/dashboard" className="text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1 translate-y-[1px]">Dashboard</Link>
            <Link href="/previous" className="text-gray-500 hover:text-gray-900 font-medium pb-1">Lessons</Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 font-medium pb-1">Library</Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 font-medium pb-1">Community</Link>
          </div>

          <div className="relative group min-w-[300px]">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Icon name="Search" className="w-4 h-4 text-emerald-400 group-focus-within:text-emerald-500" />
            </div>
            <input 
              type="text" 
              placeholder="Find materials..." 
              className="w-full bg-emerald-50/50 border-transparent focus:bg-white focus:border-emerald-200 h-10 pl-11 pr-4 rounded-xl text-sm transition-all focus:ring-0"
            />
          </div>
        </div>

        <div className='flex gap-6 items-center'>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-emerald-600 transition-colors">
              <Icon name="Bell" className="w-5 h-5" />
            </button>
            <button className="hover:text-emerald-600 transition-colors">
              <Icon name="Settings" className="w-5 h-5" />
            </button>
          </div>
          
          <Link href="/dashboard" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95">
            Start Lesson
          </Link>

          <div className='flex gap-3 items-center pl-4 border-l border-gray-100'>
            <Avatar className="w-9 h-9 border border-emerald-100 shadow-sm">
              <AvatarImage src={user?.picture || undefined} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">{user?.given_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
    </nav>
    
    <nav className='flex md:hidden p-4 bg-white border-b border-gray-100 w-full justify-between items-center fixed top-0 left-0 z-50'>
      <div className="flex items-center gap-2">
        <Image src='/icons/logo.svg' alt="ScholarSync" width={28} height={28}/>
        <span className="font-bold text-lg text-emerald-600">ScholarSync</span>
      </div>
      <Sheet>
        <SheetTrigger className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
           <Icon name='Menu' className="text-gray-600 w-6 h-6" /> 
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 border-none">
            <div className="p-8 border-b border-gray-50">
               <div className="flex items-center gap-2">
                  <Image src='/icons/logo.svg' alt="ScholarSync" width={28} height={28}/>
                  <span className="font-bold text-lg text-emerald-600">ScholarSync</span>
               </div>
            </div>
            <div className="flex flex-col p-4 gap-1">
               {sidebarLinks.map((link) => {
                  const isActive = pathname === link.route || pathname.startsWith(link.route);
                  return (
                     <Link 
                        href={link.route}
                        key={link.label}
                        className={cn(
                           'flex gap-4 items-center w-full px-4 py-3 rounded-xl transition-all duration-200', 
                           isActive ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-500 hover:bg-gray-50'
                        )}
                     >
                        <Icon name={link.icon} className="w-5 h-5" /> 
                        <p>{link.label}</p>
                     </Link>
                  )
               })}
            </div>
        </SheetContent>
      </Sheet>
    </nav>
    </>
  )
}

export default DashboardNavBar