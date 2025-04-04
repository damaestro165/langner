'use client'
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import MeetingCard from './MeetingCard';
import MeetingModal from './MeetingModal';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';
import ReactDatePicker from "react-datepicker";
import { Input } from './ui/input';


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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

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
        handleClick ={()=>router.push('/recordings')}
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
        isOpen={meetingState ==='isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type Meeting Link"
        className='text-center'
        handleClick={()=> router.push(values.link)}
        buttonText="Join Meeting"
     >
      <Input placeholder='Meeting Link'
        onChange={(e) => {
          setValues({...values, link: e.target.value})
        } }
      />
     </MeetingModal>
    {!callDetails ? (
      <MeetingModal
        isOpen={meetingState ==='isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Create Meeting"
        handleClick={createMeeting}
        buttonText="Schedule Meeting"
     >
      <div className='flex flex-col gap-3'>
          <label className='test-base text-normal leading-[22px]'>Add a Description</label>
        <Textarea required onChange={(e) =>{
          setValues({...values, description: e.target.value})
        }} />
      </div>
      <div className='flex flex-col gap-3 mt-2'>
        <label className='test-base text-normal leading-[22px]'>
          Select Date and Time
        </label>
        <ReactDatePicker
        selected={values.dateTime}
        onChange={(date) => setValues({...values, dateTime: date!})}
        showTimeSelect
        timeFormat='HH:mm'
        timeIntervals={15}
        timeCaption='time'
        dateFormat={"MMMM d, yyyy h:mm aa"} 
        className='border border-[#506674ff] rounded-md p-2'
        />
      </div>
          </MeetingModal>
    ) : (
      <MeetingModal
      isOpen={meetingState ==='isScheduleMeeting'}
      onClose={() => setMeetingState(undefined)}
      title="Meeting Created"
      className="text-center"
      handleClick={() => {
        navigator.clipboard.writeText(meetingLink);
        toast({ title: "Meeting Link Copied to Clipboard",})
      }}
      buttonText="Copy Meeting Link"
      />
    )}
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