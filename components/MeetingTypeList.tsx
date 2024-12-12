'use client'
import React, { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import MeetingCard from './MeetingCard'
import MeetingModal from './MeetingModal'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description:"",
    link:""
  })
  const [callDetails, setCallDetails] = useState<Call>()

  const { toast } = useToast()
  const {user} = useKindeBrowserClient();
  const client = useStreamVideoClient();
  const router = useRouter()

  const createMeeting = async () => {
    if(!client || !user) return;

    try {

      if (!values.dateTime){
        toast({ title: "Please Select a date and a time"})
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      

      if(!call) throw new Error('failed to create call')

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || 'instant meeting';
      

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom:{
            description
          }
        },
      });

      setCallDetails(call);

      if(!values.description){
        router.push(`/meeting/${call.id}`);
      }

      toast({ title: "Meeting Created",})
    } catch(error){
      console.log(error);
      toast({ title: "Failed to Create Meeting",})
    }
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