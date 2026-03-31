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
import { LayoutList, Users, MessageSquare, BarChart3, FileText, Calendar as CalendarIcon, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'
import TranscriptPanel from './TranscriptPanel'
import MeetingPolls from './MeetingPolls'
import SharedMaterials from './SharedMaterials'
import CalendarIntegration from './CalendarIntegration'
import VocabularyTracker, { VocabWord } from './VocabularyTracker'

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
  
  // Tool states
  const [activeTab, setActiveTab] = useState<'transcript' | 'polls' | 'materials' | 'calendar' | 'vocab' | null>(null);
  const [vocabWords, setVocabWords] = useState<VocabWord[]>([]);
  
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
    } else if (callingState === CallingState.JOINING) {
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

  const toggleTab = (tab: typeof activeTab) => {
    setActiveTab(prev => prev === tab ? null : tab);
  };

  const addVocabWord = (word: string, translation?: string) => {
    const newWord: VocabWord = {
      id: Date.now().toString(),
      word,
      translation,
      timestamp: Date.now()
    };
    setVocabWords(prev => [...prev, newWord]);
    setActiveTab('vocab'); // Auto-switch to vocab to show feedback
  };
 
  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white bg-gray-900'>
      <div className='relative flex size-full items-center justify-center '>
        <div className='flex size-full max-w-xl items-center'>
          <CallLayout/>
        </div>
        <div className={cn('h-[calc(100vh-86px)] ml-2', { 'hidden': !showParticipants })}>
            <CallParticipantsList onClose= {() => setShowParticipants(false)}/>
        </div>
      </div>
      
      <TranscriptPanel 
        isOpen={activeTab === 'transcript'} 
        onClose={() => setActiveTab(null)} 
        onSaveWord={addVocabWord}
      />
      <MeetingPolls 
        isOpen={activeTab === 'polls'} 
        onClose={() => setActiveTab(null)} 
      />
      <SharedMaterials 
        isOpen={activeTab === 'materials'} 
        onClose={() => setActiveTab(null)} 
      />
      <CalendarIntegration 
        isOpen={activeTab === 'calendar'} 
        onClose={() => setActiveTab(null)} 
      />
      <VocabularyTracker 
        isOpen={activeTab === 'vocab'} 
        onClose={() => setActiveTab(null)} 
        words={vocabWords}
        onRemoveWord={(id) => setVocabWords(prev => prev.filter(w => w.id !== id))}
        onClearAll={() => setVocabWords([])}
      />
      
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

        <div className="flex items-center gap-2 ml-2 border-l border-gray-700 pl-4">
          <button 
            onClick={() => toggleTab('transcript')}
            className={cn("p-2 rounded-2xl transition-all", activeTab === 'transcript' ? 'bg-red-600 text-white' : 'bg-[#4c535b] text-gray-300 hover:text-white')}
            title="Transcript"
          >
            <MessageSquare size={20} />
          </button>
          
          <button 
            onClick={() => toggleTab('polls')}
            className={cn("p-2 rounded-2xl transition-all", activeTab === 'polls' ? 'bg-blue-600 text-white' : 'bg-[#4c535b] text-gray-300 hover:text-white')}
            title="Quizzes"
          >
            <BarChart3 size={20} />
          </button>

          <button 
            onClick={() => toggleTab('materials')}
            className={cn("p-2 rounded-2xl transition-all", activeTab === 'materials' ? 'bg-blue-600 text-white' : 'bg-[#4c535b] text-gray-300 hover:text-white')}
            title="Materials"
          >
            <FileText size={20} />
          </button>

          <button 
            onClick={() => toggleTab('calendar')}
            className={cn("p-2 rounded-2xl transition-all", activeTab === 'calendar' ? 'bg-purple-600 text-white' : 'bg-[#4c535b] text-gray-300 hover:text-white')}
            title="Calendar"
          >
            <CalendarIcon size={20} />
          </button>

          <button 
            onClick={() => toggleTab('vocab')}
            className={cn("p-2 rounded-2xl transition-all", activeTab === 'vocab' ? 'bg-emerald-600 text-white' : 'bg-[#4c535b] text-gray-300 hover:text-white')}
            title="Vocabulary"
          >
            <Bookmark size={20} />
          </button>
        </div>

        <button onClick={() => setShowParticipants((prev) => !prev)}>
           <div className={cn("p-2 rounded-2xl transition-all", showParticipants ? 'bg-emerald-600 text-white' : 'bg-[#4c535b] text-gray-300 hover:text-white')}>
            <Users size={20} />
           </div>
        </button>
        {!isPersonalRoom && <EndCallButton/>}
      </div>
    </section>
  )
}

export default MeetingRoom