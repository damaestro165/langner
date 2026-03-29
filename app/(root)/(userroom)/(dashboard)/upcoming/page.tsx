import React from 'react'
import CallList from '@/components/CallList'


const Upcoming = () => {
  return (
    <section className='flex size-full flex-col gap-10'>
      <div className="flex flex-col gap-2">
        <h1 className='text-5xl font-extrabold text-gray-900 tracking-tight'>
          Upcoming Meetings
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          Prepare for your next learning sessions and stay ahead of your schedule.
        </p>
      </div>
      <CallList type='upcoming'/>
    </section>
  )
}

export default Upcoming