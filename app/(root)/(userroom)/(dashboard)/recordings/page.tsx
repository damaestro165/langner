import CallList from '@/components/CallList'
import React from 'react'

const Recordings = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-green-800'>
      <h1 className='text-2xl font-bold'>
       Recordings
      </h1>
       <CallList type="recordings"/>
    </section>
  )
}

export default Recordings