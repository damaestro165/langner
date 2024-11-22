'use client'
import React, { useState } from 'react'

import MeetingCard from './MeetingCard'

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

  return (
  <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-3 lg:p-3 content-center '>
      <MeetingCard
        img="/icons/add-meeting.svg"
        title = "New Meeting"
        description="Start an instant meeting"
        handleClick ={()=>setMeetingState('isJoiningMeeting')}
        className="bg-green-200"
    />
    <MeetingCard
        img="/icons/add-meeting.svg"
        title = "New Meeting"
        description="Start an instant meeting"
        handleClick ={()=>setMeetingState('isJoiningMeeting')} 
        className="bg-green-200"
    />
    <MeetingCard
        img="/icons/add-meeting.svg"
        title = "New Meeting"
        description="Start an instant meeting"
        handleClick ={()=>setMeetingState('isJoiningMeeting')}
        className="bg-green-200"
    />
    <MeetingCard
        img="/icons/add-meeting.svg"
        title = "New Meeting"
        description="Start an instant meeting"
        handleClick ={()=>setMeetingState('isJoiningMeeting')}
        className="bg-green-200"
    />
      
  </div>
    
  )
}

export default MeetingTypeList