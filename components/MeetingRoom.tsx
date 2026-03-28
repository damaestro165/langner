import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCall } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'

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
import InteractiveWhiteboard from './InteractiveWhiteboard'
import MeetingPolls from './MeetingPolls'
import SharedMaterials from './SharedMaterials'
import CalendarIntegration from './CalendarIntegration'

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal')
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants, setShowParticipants] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing meeting...');
  
  const call = useCall();
  const callingState = call?.state?.callingState;

  useEffect(() => {
    // Detect if call is in an error state or taking too long to join
    if (!call) {
      setJoinError('Call object not found');
      return;
    }

    // Set a timeout to catch slow connections
    const timeoutId = setTimeout(() => {
      if (callingState !== CallingState.JOINED) {
        console.error('Call join timeout - current state:', callingState);
        setJoinError('Call join timeout - please refresh and try again');
      }
    }, 30000); // 30 seconds timeout

    // Track call state changes
    console.log('Current call state:', callingState);
    
    if (callingState === CallingState.JOINED) {
      setIsJoining(false);
      console.log('Call joined successfully');
    } else if (callingState === CallingState.CONNECTING) {
      setLoadingMessage('Connecting to meeting...');
      console.log('Call connecting...');
    } else if (callingState === CallingState.RECONNECTING) {
      setLoadingMessage('Connection interrupted. Reconnecting...');
      console.log('Call reconnecting...');
    } else if (callingState === CallingState.OFFLINE) {
      setJoinError('Connection lost - please refresh and try again');
    }

    return () => clearTimeout(timeoutId);
  }, [call, callingState]);

  if (joinError) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col bg-gray-900 text-white">
        <p className="text-red-500 mb-4 text-center px-4">{joinError}</p>
        <button 
          className="px-4 py-2 bg-green-700 rounded-md"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (callingState !== CallingState.JOINED || isJoining) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col bg-gray-900 text-white">
        <Loader 
          message={loadingMessage}
          subMessage="This may take a moment. If it's taking too long, try refreshing the page."
        />
      </div>
    );
  }

  const CallLayout = () => {
    switch (layout) {
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
        <div className={cn('h-[calc(100vh-86px)] ml-2', { 'hidden': !showParticipants })}>
            <CallParticipantsList onClose= {() => setShowParticipants(false)}/>
        </div>
      </div>
      
      <TranscriptPanel />
      <InteractiveWhiteboard />
      <MeetingPolls />
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
           <div className="cursor-pointer rounded-2xl bg-[#4c535b] p-2">
            <Users size={20} className="text-white" />
           </div>
        </button>
        {!isPersonalRoom && <EndCallButton/>}
      </div>
    </section>
  )
}

export default MeetingRoom