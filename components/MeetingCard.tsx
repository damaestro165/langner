'use client'
import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'
import Icon from './DynamicIcon';
import * as Icons from 'lucide-react'; //

interface HomeCardProps {
    className: string,
    icon: keyof typeof Icons,
    title: string,
    description: string,
    handleClick: () => void;
}

const MeetingCard = ({className, icon, title, description, handleClick}: HomeCardProps) => {
    className

  return (
     <div 
      className={cn(
        "group p-8 flex flex-col justify-between w-full h-[260px] rounded-[32px] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-50", 
        className
      )} 
      onClick={handleClick}
    > 
        <div className='flex bg-white/20 p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 group-hover:rotate-3'>
          <Icon name={icon} className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
          <p className="text-sm font-medium opacity-80 leading-relaxed">{description}</p>
        </div>
      </div>
  )
}

export default MeetingCard