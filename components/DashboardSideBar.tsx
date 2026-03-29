'use client'
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Icon from "./DynamicIcon"


const DashboardSideBar = () => {

    const pathname = usePathname()
  return (
    <section className="fixed z-50 bg-white flex h-screen w-64 flex-col items-start px-6 py-8 max-sm:hidden border-r border-gray-100 shadow-sm">
      <Link href='/dashboard' className='flex items-center gap-2 mb-10'>
            <Image src='/icons/logo.svg' alt="ScholarSync" width={32} height={32} className='w-8 h-8'/>
            <span className="font-bold text-xl text-emerald-600">ScholarSync</span>
      </Link>
      
      <div className="flex flex-col w-full gap-2">
            {sidebarLinks.map((link) => {
                const isActive = pathname === link.route || pathname.startsWith(link.route);
                return (
                        <Link 
                        href={link.route}
                        key={link.label}
                        className={cn(
                          'flex gap-4 items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group', 
                          isActive ? 'bg-emerald-50 text-emerald-600 font-medium' : 'hover:bg-gray-50 text-gray-400 hover:text-gray-600'
                        )}
                        >
                          <Icon name={link.icon} className={cn('w-5 h-5', isActive ? 'text-emerald-600' : 'group-hover:text-gray-600')} /> 
                          <span className="text-sm">{link.label}</span>
                        </Link>
                )
            })}
      </div>

      <div className="mt-auto w-full">
         {/* User Join Room Card at bottom of sidebar */}
         <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <Image src="/images/tutor_placeholder.png" alt="Tutor" width={40} height={40} />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-gray-900 leading-tight">The Modern Scholar</p>
                  <p className="text-[8px] text-gray-500">Level C1 • English</p>
               </div>
            </div>
            <Link href="/dashboard" className="bg-emerald-600 text-white text-[10px] font-bold py-2 rounded-lg text-center hover:bg-emerald-700 transition-colors">
               Join Room
            </Link>
         </div>
      </div>
    </section>
  )
}

export default DashboardSideBar