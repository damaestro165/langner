"use client"
import { useGetCall } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { use, useLayoutEffect, useState } from 'react'
import CallCard from './CallCard';
import { Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';




const CallList = ({type}: {type: "ended" | "upcoming" | "recordings"}) => {
    const {endedCalls, UpcomingCalls, callRecordings, isLoading} = useGetCall();
    const router = useRouter();
    const [recordings, setRecordings] = useState<CallRecording[]>([]);
     const [loadingRecordings, setLoadingRecordings] = useState(false);
     const { toast } = useToast()



    const getCalls = () => {
        switch (type) {
            case "ended":
                return endedCalls;
            case "upcoming":
                return UpcomingCalls; 
            case "recordings":
                return recordings;
            default:
                return [];
        }
    }          

    const getNOCallsMessage = () => {
        switch (type) {
            case "ended":
                return "No Previous Calls ";
            case "upcoming":
                return "No Upcoming Calls"; 
            case "recordings":
                return " No recordings";
            default:
                return '';
        } 
    }        
    
    const calls = getCalls();
    const noCallsMessage = getNOCallsMessage();
    

      useLayoutEffect(() => {
        const fetchRecordings = async () => {
      try {
        setLoadingRecordings(true);
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
    toast({title: "Please try again later!"});
      } finally {
        setLoadingRecordings(false);
      }
    };

    if (type === "recordings") fetchRecordings();
  }, [type, callRecordings]);

    if(isLoading) return <h1 className='text-center text-lg font-semibold text-gray-500'>Loading...</h1>

  return ( 
    <div className='grid grid-cols-1 gap-8 xl:grid-cols-3'>
        { calls && calls.length > 0 ? 
                    calls.map((meeting: Call | CallRecording) =>(
                    <CallCard
                    key={(meeting as Call).id || crypto.randomUUID()}
                    icon={
                    type === "ended"
                        ? "/icons/previous.svg"
                        : type === "upcoming"
                        ? "/icons/upcoming.svg"
                        : "/icons/recordings.svg"
                    }
                    title={
                    (meeting as Call).state?.custom?.description ||
                    (meeting as CallRecording).filename ||
                    "No Description"
                    }
                    date={
                    (meeting as Call).state?.startsAt?.toLocaleString() ||
                    (meeting as CallRecording).start_time?.toLocaleString() ||
                    new Date().toLocaleString()
                    }
                    isPreviousMeeting={type === "ended"}
                    link={
                    type === "recordings"
                        ? (meeting as CallRecording).url
                        : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                    }
                    ButtonIcon={type === "recordings" ? Play : undefined}
                    buttonText={type === "recordings" ? "Play" : "Start"}
                    handleClick={
                    type === "recordings"
                        ? () => router.push((meeting as CallRecording).url)
                        : () => router.push(`/meeting/${(meeting as Call).id}`)
                    }
                />
                    )): null
        }
        
        {/* Start New Session Placeholder Card */}
        <div 
          onClick={() => router.push('/dashboard')}
          className="flex flex-col items-center justify-center gap-4 rounded-[32px] p-8 bg-emerald-50/50 border-2 border-dashed border-emerald-200 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 group min-h-[300px]"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-900">Start New Session</h4>
            <p className="text-sm text-gray-500">Connect with a tutor instantly</p>
          </div>
        </div>
    </div>
  )
}

export default CallList