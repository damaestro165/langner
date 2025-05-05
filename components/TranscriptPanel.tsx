"use client";

import { useState, useEffect, useRef } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Save, X } from 'lucide-react';

type TranscriptEntry = {
  id: string;
  speakerName: string;
  text: string;
  timestamp: number;
  edited: boolean;
};

const TranscriptPanel = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // This would connect to a real transcription service like Google Speech-to-Text
  useEffect(() => {
    if (!showTranscript) return;
    
    // Mock transcript generation for demo purposes
    const transcriptInterval = setInterval(() => {
      if (participants.length > 0) {
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        setTranscript(prev => [...prev, {
          id: Date.now().toString(),
          speakerName: randomParticipant.name || randomParticipant.userId || 'Unknown Speaker',
          text: `This is a simulated transcript entry. In production, this would be real speech converted to text.`,
          timestamp: Date.now(),
          edited: false,
        }]);
      }
    }, 10000); // Add a new entry every 10 seconds for demo
    
    return () => clearInterval(transcriptInterval);
  }, [showTranscript, participants]);
  
  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollRef.current && transcript.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);
  
  const handleEditStart = (entry: TranscriptEntry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
  };
  
  const handleSaveEdit = () => {
    if (!editingId) return;
    
    setTranscript(prev => prev.map(entry => 
      entry.id === editingId 
        ? { ...entry, text: editText, edited: true } 
        : entry
    ));
    
    setEditingId(null);
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!showTranscript) {
    return (
      <Button 
        onClick={() => setShowTranscript(true)}
        className="fixed right-4 bottom-20 rounded-full p-3 bg-green-700 text-white"
        title="Show Transcript"
      >
        <MessageSquare size={20} />
      </Button>
    );
  }

  return (
    <div className="fixed right-4 bottom-20 bg-white text-black rounded-lg shadow-lg w-80 h-96 flex flex-col">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-medium">Live Transcript</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowTranscript(false)}>
          <X size={18} />
        </Button>
      </div>
      
      <div className="flex-grow p-3 overflow-y-auto" ref={scrollRef}>
        {transcript.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">Transcript will appear here as people speak...</p>
        ) : (
          transcript.map(entry => (
            <div key={entry.id} className="mb-3">
              <div className="flex justify-between text-xs text-gray-500">
                <span className="font-medium">{entry.speakerName}</span>
                <span>{formatTime(entry.timestamp)}</span>
              </div>
              
              {editingId === entry.id ? (
                <div className="mt-1">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="mb-1"
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p 
                  className="mt-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => handleEditStart(entry)}
                >
                  {entry.text}
                  {entry.edited && <span className="text-xs text-gray-500 ml-1">(edited)</span>}
                </p>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 border-t flex justify-end">
        <Button size="sm" className="bg-green-700">
          <Save size={16} className="mr-1" />
          Save Transcript
        </Button>
      </div>
    </div>
  );
};

export default TranscriptPanel; 