import CallList from '@/components/CallList'
import React from 'react'

const Previous = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-green-800'>
      <h1 className='text-2xl font-bold'>
       Previuos Meetings
      </h1>
      <CallList type="ended"/>
    </section>
  )
}

export default Previous