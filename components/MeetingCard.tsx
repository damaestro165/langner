'use client'
import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'
import Icon from './DynamicIcon';

interface HomeCardProps {
    className: string,
    icon: string,
    title: string,
    description: string,
    handleClick: () => void;
}

const MeetingCard = ({className, icon, title, description, handleClick}: HomeCardProps) => {
    className

  return (
     <div className={cn("px-4 py-6 flex gap-4 flex-col justify-between w-full lg:min-w-[180px] lg:min-h-[230px] rounded-[14px] cursor-pointer text-white", className)} onClick={handleClick}> 
        <div className=' flex bg-white text-gray-500 rounded-full justify-center items-center size-12 lg:self-center'>
          <Icon name={icon} size={24} />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className='text-xl font-bold'>{title}</h1>
          <p className="font-normal">{description}</p>
        </div>
      </div>
  )
}

export default MeetingCard