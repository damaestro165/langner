import CallList from '@/components/CallList'
import React from 'react'

const Recordings = () => {
  return (
    <section className='flex size-full flex-col gap-10'>
      <div className="flex flex-col gap-2">
        <h1 className='text-5xl font-extrabold text-gray-900 tracking-tight'>
          Recordings
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          Access your past lesson recordings and review the knowledge shared.
        </p>
      </div>
       <CallList type="recordings"/>
    </section>
  )
}

export default Recordings