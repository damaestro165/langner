import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCall } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'
import TranscriptPanel from './TranscriptPanel'
import SharedMaterials from './SharedMaterials'
import CalendarIntegration from './CalendarIntegration'


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal')
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants, setShowParticipants] = useState(false)
  
  const call = useCall();
  const callingState = call?.state?.callingState;

  if (callingState !== CallingState.JOINED) return <Loader/>
  const CallLayout = () =>{
      switch (layout){
          case "grid":
            return <PaginatedGridLayout/>
          case "speaker-right":
            return <SpeakerLayout participantsBarPosition="left"/>
          default:
            return <SpeakerLayout participantsBarPosition="right"/>
          
      }
  }
 
  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center '>
        <div className='flex size-full max-w-xl items-center'>
          <CallLayout/>
        </div>
        <div className={cn('h-[calc(100vh-86px)] hidden ml-2', {'show-block': showParticipants})}>
            <CallParticipantsList onClose= {() => setShowParticipants(false)}/>
        </div>
      </div>
      
      <TranscriptPanel />
      <SharedMaterials />
      <CalendarIntegration />
      
      <div className='fixed bottom-0 flex w-full mt-5 items-center justify-center gap-5'>
        <CallControls onLeave={() => router.push(`/dashboard`)} />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
              <LayoutList size={20} className='text-white'/>
            </DropdownMenuTrigger>
          </div>
          
          <DropdownMenuContent className="w-32 bg-[#64707c] text-white" sideOffset={5}>
           {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
            <div key={index}>
                <DropdownMenuItem className="cursor-pointer"
                onClick={()=>{
                  setLayout(item.toLowerCase() as CallLayoutType)
                }}
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-slate-600' />
            </div>
           ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton/>
        <button onClick={() => setShowParticipants((prev) => !prev)}>
           <div className="cursor-pointer rounded-2xl bg-[#4c535b]">
            <Users size={20} className="text-white" />
           </div>
        </button>
        {!isPersonalRoom && <EndCallButton/>}
      </div>

    </section>
  )
}

export default MeetingRoom