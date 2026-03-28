'use client'
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'

const MeetingSetup = ({setIsSetupComplete}: {setIsSetupComplete:(value:boolean) => void}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const call = useCall();
  
  useEffect(() => {
    if(!call){
      setError('Call not found. Please refresh the page.');
      return;
    } 

    try {
      if(isMicCamToggledOn){
        call?.camera.disable();
        call?.microphone.disable();
      } else {
        call?.camera.enable();
        call?.microphone.enable();
      }
    } catch (err) {
      console.error('Error toggling devices:', err);
      setError('Failed to toggle camera/microphone. Please check your device permissions.');
    }
  }, [isMicCamToggledOn, call]);

  const handleJoinMeeting = async () => {
    if (!call) {
      setError('Call not found. Please refresh the page.');
      return;
    }

    setIsJoining(true);
    try {
      console.log('Attempting to join call...');
      await call.join();
      console.log('Join call successful');
      setIsSetupComplete(true);
    } catch (err) {
      console.error('Failed to join meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to join meeting. Please try again.');
      setIsJoining(false);
    }
  };

  if (error) {
    return (
      <div className='flex h-screen w-full flex-col items-center justify-center gap-3 p-5'>
        <div className='text-red-500 mb-4 text-center max-w-md'>
          <h2 className='text-xl font-bold mb-2'>Error</h2>
          <p>{error}</p>
        </div>
        <Button 
          className='rounded-md bg-green-600 px-4 py-2.5'
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className='flex h-screen w-full lg:p-10 flex-col items-center justify-center gap-3'>
      <h1 className='text-2xl font-bold'>Setup</h1>
      <div className='lg:w-[35rem]'><VideoPreview/></div>
      <div className='flex items-center mt-2 justify-center gap-3'>
        <label className='flex items-center justify-center gap-2 font-medium'>
          <input 
            type='checkbox'
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings/>
      </div>
      <Button 
        className='rounded-md bg-green-600 px-4 py-2.5' 
        onClick={handleJoinMeeting}
        disabled={isJoining}
      >
        {isJoining ? 'Joining...' : 'Join Meeting'}
      </Button>
    </div>
  )
}

export default MeetingSetup