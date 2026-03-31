"use client";

import { useEffect, useState } from 'react';
import { useCallStateHooks, useCall } from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, Plus, Trash2, X, CheckSquare } from 'lucide-react';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  authorId: string;
};

interface MeetingPollsProps {
  isOpen: boolean;
  onClose: () => void;
}

const MeetingPolls = ({ isOpen, onClose }: MeetingPollsProps) => {
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState([{ id: '1', text: '' }, { id: '2', text: '' }]);

  // Listen for incoming custom events
  useEffect(() => {
    if (!call) return;
    
    const unsubscribe = call.on('custom', (event: any) => {
      // Poll Created Broadcast
      if (event.custom?.type === 'poll-created') {
        const payload = event.custom.data as Poll;
        setActivePoll(payload);
        setHasVoted(false);
        setIsOpen(true); // Auto-open panel when a poll is created!
      }
      
      // Poll Answered Broadcast (Real-time vote counting)
      if (event.custom?.type === 'poll-answered') {
        const { pollId, optionId } = event.custom.data;
        setActivePoll(prev => {
          if (!prev || prev.id !== pollId) return prev;
          return {
            ...prev,
            options: prev.options.map(opt => 
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            )
          };
        });
      }

      // Poll Closed Broadcast
      if (event.custom?.type === 'poll-closed') {
        const { pollId } = event.custom.data;
        setActivePoll(prev => {
          if (!prev || prev.id !== pollId) return prev;
          return { ...prev, isActive: false };
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [call]);

  const addOption = () => {
    if (newOptions.length >= 6) return;
    setNewOptions([...newOptions, { id: Date.now().toString(), text: '' }]);
  };

  const removeOption = (id: string) => {
    if (newOptions.length <= 2) return;
    setNewOptions(newOptions.filter(opt => opt.id !== id));
  };

  const updateOption = (id: string, text: string) => {
    setNewOptions(newOptions.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const createPoll = () => {
    if (!newQuestion.trim() || newOptions.some(opt => !opt.text.trim())) return;
    if (!call || !localParticipant) return;

    const poll: Poll = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      options: newOptions.map(opt => ({ ...opt, text: opt.text.trim(), votes: 0 })),
      isActive: true,
      authorId: localParticipant.userId
    };

    // Broadcast to room
    call.sendCustomEvent({
      type: 'poll-created',
      data: poll
    }).catch(console.error);

    // Set locally
    setActivePoll(poll);
    setHasVoted(false);
    setIsCreating(false);
    setNewQuestion('');
    setNewOptions([{ id: '1', text: '' }, { id: '2', text: '' }]);
  };

  const vote = (optionId: string) => {
    if (!activePoll || !activePoll.isActive || hasVoted || !call) return;

    // Broadcast vote to room securely
    call.sendCustomEvent({
      type: 'poll-answered',
      data: { pollId: activePoll.id, optionId }
    }).catch(console.error);

    // Update locally instantly
    setActivePoll(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        options: prev.options.map(opt => 
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        )
      };
    });
    setHasVoted(true);
  };

  const closePoll = () => {
    if (!activePoll || !call) return;
    
    // Broadcast stop
    call.sendCustomEvent({
      type: 'poll-closed',
      data: { pollId: activePoll.id }
    }).catch(console.error);
    
    // Update locally
    setActivePoll(prev => prev ? { ...prev, isActive: false } : null);
  };

  const totalVotes = activePoll ? activePoll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
  const isHost = activePoll?.authorId === localParticipant?.userId;

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-36 bg-gray-900 border border-gray-700 text-white rounded-xl shadow-2xl w-80 max-h-[500px] flex flex-col overflow-hidden z-50 transition-all">
      <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800">
        <h3 className="font-medium flex items-center gap-2">
          <BarChart3 size={16} className="text-blue-500" />
          Lesson Quizzes
          {activePoll?.isActive && (
            <span className="bg-red-500 text-white text-[10px] uppercase px-1.5 py-0.5 rounded animate-pulse font-bold ml-1">Live</span>
          )}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-gray-700 text-gray-300">
          <X size={16} />
        </Button>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
        {!activePoll && !isCreating ? (
          <div className="flex flex-col items-center justify-center text-gray-400 opacity-80 py-8">
            <BarChart3 size={40} className="mb-3 opacity-40 text-blue-500" />
            <p className="text-center text-sm font-medium">No active polls</p>
            <p className="text-center text-xs mt-1 text-gray-500 mb-6">Create a poll to quiz your students!</p>
            <Button 
              className="bg-blue-700 hover:bg-blue-600 w-full" 
              onClick={() => setIsCreating(true)}
            >
              <Plus size={16} className="mr-1.5" /> Create New Poll
            </Button>
          </div>
        ) : isCreating ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Question</label>
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g. Which conjugation is correct?"
                className="h-9 text-sm bg-gray-800 border-gray-700 focus-visible:ring-blue-500"
                autoFocus
              />
            </div>
            
            <div className="flex flex-col gap-2 mt-1">
              <label className="text-xs text-gray-400 font-medium block">Options</label>
              {newOptions.map((opt, index) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <Input
                    value={opt.text}
                    onChange={(e) => updateOption(opt.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="h-8 text-sm bg-gray-800 border-gray-700 focus-visible:ring-blue-500"
                  />
                  {newOptions.length > 2 && (
                    <Button variant="ghost" size="sm" onClick={() => removeOption(opt.id)} className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30">
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
              
              {newOptions.length < 6 && (
                <Button variant="outline" size="sm" onClick={addOption} className="mt-1 sticky h-8 border-dashed border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800">
                  <Plus size={14} className="mr-1" /> Add Option
                </Button>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-700">
              <Button variant="ghost" className="flex-1 bg-gray-800 hover:bg-gray-700 text-sm h-9" onClick={() => { setIsCreating(false); setActivePoll(null); }}>Cancel</Button>
              <Button 
                className="flex-1 bg-blue-700 hover:bg-blue-600 text-sm h-9" 
                onClick={createPoll}
                disabled={!newQuestion.trim() || newOptions.some(opt => !opt.text.trim())}
              >
                Launch Poll
              </Button>
            </div>
          </div>
        ) : activePoll ? (
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-[15px] text-white leading-tight">{activePoll.question}</h4>
            
            <div className="flex flex-col gap-2.5">
              {activePoll.options.map((opt) => {
                const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                const isWinner = !activePoll.isActive && opt.votes > 0 && opt.votes === Math.max(...activePoll.options.map(o => o.votes));
                
                return (
                  <div key={opt.id} className="relative group/poll">
                    {/* Background Progress Bar */}
                    {(hasVoted || !activePoll.isActive) && (
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-md transition-all duration-500 ease-out ${isWinner ? 'bg-green-600/30' : 'bg-blue-600/20'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    )}
                    
                    {/* The Button */}
                    <button
                      onClick={() => vote(opt.id)}
                      disabled={hasVoted || !activePoll.isActive}
                      className={`relative w-full flex justify-between items-center p-3 rounded-md border text-sm transition-all focus:outline-none 
                        ${hasVoted || !activePoll.isActive ? 'border-transparent bg-gray-800/50 cursor-default' : 'border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 cursor-pointer'} 
                        ${isWinner ? 'border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : ''}
                      `}
                    >
                      <div className="flex items-center gap-2 z-10 font-medium">
                        {isWinner && <CheckSquare size={14} className="text-green-400" />}
                        {opt.text}
                      </div>
                      
                      {(hasVoted || !activePoll.isActive) && (
                        <div className="flex items-center gap-2 text-xs text-gray-300 z-10">
                          <span>{opt.votes}</span>
                          <span className="text-gray-500 font-mono w-8 text-right">{percentage}%</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500 mt-2 pt-3 border-t border-gray-800">
              <span>{totalVotes} total votes</span>
              
              {isHost && activePoll.isActive && (
                <Button variant="destructive" size="sm" onClick={closePoll} className="h-7 text-xs bg-red-900/80 text-red-200 hover:bg-red-800 hover:text-white">
                  Close Poll
                </Button>
              )}
            </div>
            
            {/* If closed, show a "Start new poll" button for host */}
            {!activePoll.isActive && (
              <Button 
                variant="outline" 
                className="w-full h-9 text-blue-400 border-blue-900/50 hover:bg-blue-900/20 hover:text-blue-300 bg-gray-900 mt-1" 
                onClick={() => { setActivePoll(null); setIsCreating(true); }}
              >
                Create another poll
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MeetingPolls;
