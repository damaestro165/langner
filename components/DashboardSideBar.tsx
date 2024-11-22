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
    <section className=" fixed z-50 bg-white flex h-screen w-[4.5%] flex-col items-center justify-between max-sm:hidden border-r-[1px]">
      <Link href='/dashboard' className='flex items-center gap-1 my-3  '>
            <Image src='./icons/logo.svg' alt="Langner" width={24} height={24} className='w-10'/>
      </Link>
        <div className="flex flex-col h-full items-center mt-3 gap-4">
           
            {sidebarLinks.map((link) => {
                const isActive = pathname === link.route || pathname.startsWith(link.route);
                return (
                        <Link 
                        href={link.route}
                        key={link.label}
                        className={cn('flex gap-3 items-center  p-[.68rem] xl:p-[1.2rem]  justify-start text-gray-400 ', {'bg-green-100 border-r-2 border-r-green-700 text-green-700 ': isActive})}
                        >
                        <Icon name={link.icon} /> 
                  
                        </Link>
                )
                    
            })}
        </div>
    </section>
  )
}

export default DashboardSideBar