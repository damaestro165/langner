"use client";
import React, { useState } from 'react'
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';
import { useGetCallById } from '@/hooks/useGetCallById';
import Loader from '@/components/Loader';

const Meeting = ({ params: {id} }: { params: { id: string } }) => {
 const {user, isAuthenticated} = useKindeBrowserClient();
 const [isSetupComplete, setIsSetupComplete] = useState(false)
 const { call, isCallLoading, error } = useGetCallById(id);

 if(!isAuthenticated || isCallLoading) return <Loader/>
 
 if (error) return <div>Error loading meeting: {error.message}</div>
 
 if (!call) return <Loader/> // Additional safeguard

 return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? <MeetingSetup setIsSetupComplete={setIsSetupComplete}/> : <MeetingRoom/> }
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting
