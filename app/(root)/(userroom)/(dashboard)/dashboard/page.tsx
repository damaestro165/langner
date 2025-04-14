import React from 'react'
import UpcomingMeetingCard from '@/components/UpcomingMeetingCard';
import MeetingTypeList from '@/components/MeetingTypeList';
import CallList from '@/components/CallList';


const DashboardHome = () => {
  const now = new Date();

  const date = (new Intl.DateTimeFormat('en-US', {dateStyle:'full'})).format  (now);
  const time = now.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', });

  return (
    <section className='flex flex-col lg:flex-row h-full gap-3 w-full '>
     <div className='w-full lg:w-1/2 flex-col gap-5'>
       <div className=' h-[18rem] bg-hero bg-cover rounded-lg lg:rounded-2xl mb-2'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
        <h2 className='bg-green-100 w-fit p-2 text-green-800'>
        Upcoming Meeting at: 6:56 PM
        </h2>
        <div className='flex flex-col gap-2 text-green-800'>
          <h2 className='text-3xl font-extrabold lg:text-5xl'>
            {time}
          </h2>
          <p>{date}</p>
        </div>
        </div>
       </div>
     </div>
    <div className='lg:bg-gray-100 lg:w-1/2 h-fit rounded-2xl '>
    <MeetingTypeList/>
    </div>
    <div className=' flex flex-col gap-2 lg:gap-4 p-2 '>
        <div className='flex justify-between  text-green-950'>
          <h1 className='font-bold'> Today`s Upcoming Meetings </h1>
        </div>
        <CallList type='upcoming'/>
       </div>
      
    </section>
  )
}

export default DashboardHome