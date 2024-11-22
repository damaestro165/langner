import React from 'react'
import Icon from './DynamicIcon'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'


const UpcomingMeetingCard = () => {
  return (
    <div className=' flex flex-col gap-2 p-4 bg-green-100 rounded-sm text-green-800'>
        <Icon name="CalendarClock" size={24} />
        <div className='flex flex-col'>
            <h2 className='font-semibold'>Title </h2>
            <p className='text-xs'>Time and date</p>
        </div>
       <div className='flex justify-between'>
         <div className='flex flex-row '>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className='flex gap-2 justify-evenly'>
           <Button>Hello</Button>
           <Button>Copy Invitation</Button>
        </div>
       </div>
    </div>
  )
}

export default UpcomingMeetingCard