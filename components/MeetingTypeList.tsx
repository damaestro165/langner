'use client'
import React, { useState } from 'react'

import MeetingCard from './MeetingCard'
import MeetingModal from './MeetingModal'

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

  const createMeeting = () => {

  } 

  return (
  <div className='grid grid-cols-1 md:grid-cols-2 justify-items-center gap-3 lg:p-3 content-center '>
      <MeetingCard
        icon="Plus"
        title = "New Meeting"
        description="Start an instant meeting"
        handleClick ={()=>setMeetingState('isInstantMeeting')}
        className="bg-[#312924ff]"
    />
    <MeetingCard
        icon="CalendarFold"
        title = "Schedule Meeting"
        description="Plan your meeting"
        handleClick ={()=>setMeetingState('isScheduleMeeting')} 
        className="bg-[#506674ff]"
    />
    <MeetingCard
        icon="Video"
        title = "View Recordings"
        description="Check your recordings"
        handleClick ={()=>setMeetingState('isJoiningMeeting')}
        className="bg-[#857E7Cff]"
    />
    <MeetingCard
        icon="SquareMousePointer"
        title = "Join Meeting"
        description="Via invitation "
        handleClick ={()=>setMeetingState('isJoiningMeeting')}
        className="bg-[#81B7D4ff]"
    />
    
    <MeetingModal
      isOpen={meetingState ==='isInstantMeeting'}
      onClose={() => setMeetingState(undefined)}
      title="Start an Instant Meeting"
      className="text-center"
      buttonText="Start Meeting"
      handleClick={createMeeting}
    />
  </div>
    
  )
}

export default MeetingTypeList