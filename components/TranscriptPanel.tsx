"use client";

import { useState, useEffect, useRef } from 'react';
import { useCallStateHooks, useCall } from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Save, X, Bookmark, PenLine, CheckCircle2 } from 'lucide-react';

type TranscriptEntry = {
  id: string;
  speakerName: string;
  text: string;
  timestamp: number;
  edited: boolean;
  translatedText?: string;
  correction?: string;
};

const LANGUAGES = [
  { code: 'none', label: 'Off' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' }
];

const mockTranslate = (text: string, langCode: string) => {
  if (langCode === 'none') return undefined;
  const langLabel = LANGUAGES.find(l => l.code === langCode)?.label || langCode;
  return `[${langLabel} Translation] ${text}`;
};

const TranscriptPanel = () => {
  const call = useCall();
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [correctingId, setCorrectingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('none');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Initialize Web Speech API
  useEffect(() => {
    if (!showTranscript || !call || !localParticipant) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript.trim().length > 0) {
          const rawText = finalTranscript.trim();
          const newEntry: TranscriptEntry = {
            id: Date.now().toString() + "-" + Math.random().toString(36).substr(2, 9),
            speakerName: localParticipant.name || localParticipant.userId || 'Me',
            text: rawText,
            timestamp: Date.now(),
            edited: false,
            // Our local translation (simulated)
            translatedText: mockTranslate(rawText, targetLanguage)
          };
          
          // Add to local state
          setTranscript(prev => [...prev, newEntry]);
          
          // Broadcast to other participants in the room
          call.sendCustomEvent({
            type: 'transcript',
            data: {
              id: newEntry.id,
              speakerName: newEntry.speakerName,
              text: newEntry.text,
              timestamp: newEntry.timestamp,
              edited: newEntry.edited
            }
          }).catch(console.error);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
      };
      
      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Error starting speech recognition:", err);
      }
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [showTranscript, call, localParticipant, targetLanguage]);

  // Listen for incoming custom events from other participants
  useEffect(() => {
    if (!call || !showTranscript) return;
    
    const unsubscribe = call.on('custom', (event: any) => {
      // Handle new transcript broadcast from others
      if (event.custom?.type === 'transcript') {
        const payload = event.custom.data as TranscriptEntry;
        if (event.user?.id !== localParticipant?.userId) {
          setTranscript(prev => {
            if (prev.some(t => t.id === payload.id)) return prev;
            // Apply mock translation immediately upon receiving
            const translatedText = mockTranslate(payload.text, targetLanguage);
            return [...prev, { ...payload, translatedText }];
          });
        }
      }
      
      // Handle transcript edit broadcast from others
      if (event.custom?.type === 'transcript-edit') {
        const { id, text } = event.custom;
        setTranscript(prev => prev.map(entry => 
          entry.id === id 
            ? { ...entry, text, edited: true, translatedText: mockTranslate(text, targetLanguage) } 
            : entry
        ));
      }

      // Handle teacher correction broadcast
      if (event.custom?.type === 'transcript-correction') {
        const { id, correction } = event.custom;
        setTranscript(prev => prev.map(entry => 
          entry.id === id 
            ? { ...entry, correction } 
            : entry
        ));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [call, showTranscript, localParticipant, targetLanguage]);
  
  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollRef.current && transcript.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);
  
  // Re-translate all entries when the target language changes
  useEffect(() => {
    setTranscript(prev => prev.map(entry => ({
      ...entry,
      translatedText: mockTranslate(entry.text, targetLanguage)
    })));
  }, [targetLanguage]);

  const handleEditStart = (entry: TranscriptEntry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
  };
  
  const handleCorrectionStart = (entry: TranscriptEntry) => {
    setCorrectingId(entry.id);
    setEditText(entry.text);
  };

  const handleSaveEdit = () => {
    if (!editingId || !call) return;
    call.sendCustomEvent({ type: 'transcript-edit', id: editingId, text: editText }).catch(console.error);
    setTranscript(prev => prev.map(entry => 
      entry.id === editingId 
        ? { ...entry, text: editText, edited: true, translatedText: mockTranslate(editText, targetLanguage) } 
        : entry
    ));
    setEditingId(null);
  };

  const handleSaveCorrection = () => {
    if (!correctingId || !call) return;
    // Broadcast correction to others
    call.sendCustomEvent({ type: 'transcript-correction', id: correctingId, correction: editText }).catch(console.error);
    setTranscript(prev => prev.map(entry => 
      entry.id === correctingId 
        ? { ...entry, correction: editText } 
        : entry
    ));
    setCorrectingId(null);
  };

  const handleSaveToVocab = (entry: TranscriptEntry) => {
    // In a real app, this would hit an API endpoint to save the word to the user's flashcard deck.
    alert(`Saved to Vocabulary Deck:\nOriginal: ${entry.text}\nTranslation: ${entry.translatedText || 'N/A'}`);
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const saveTranscriptToFile = () => {
    if (transcript.length === 0) return;
    const content = transcript.map(t => {
      let line = `[${formatTime(t.timestamp)}] ${t.speakerName}: ${t.text}${t.edited ? ' (edited)' : ''}`;
      if (t.correction) line += `\n    -> Teacher Correction: ${t.correction}`;
      if (t.translatedText) line += `\n    -> Translation: ${t.translatedText}`;
      return line;
    }).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lesson-Transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!showTranscript) {
    return (
      <Button 
        onClick={() => setShowTranscript(true)}
        className="fixed right-4 bottom-28 rounded-full p-3 bg-green-700 hover:bg-green-600 text-white shadow-md transition-colors z-[100]"
        title="Show Transcript"
      >
        <MessageSquare size={20} />
      </Button>
    );
  }

  return (
    <div className="fixed right-4 bottom-20 bg-gray-900 border border-gray-700 text-white rounded-xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden z-50 transition-all">
      <div className="flex flex-col border-b border-gray-700 bg-gray-800">
        <div className="flex justify-between items-center p-3">
          <h3 className="font-medium flex items-center gap-2">
            <MessageSquare size={16} className="text-green-500" />
            Live Transcript
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setShowTranscript(false)} className="h-8 w-8 p-0 rounded-full hover:bg-gray-700 text-gray-300">
            <X size={16} />
          </Button>
        </div>
        
        {/* Subtitles / Language Selector */}
        <div className="px-3 pb-3 flex items-center gap-2">
          <span className="text-xs text-gray-400">Subtitles:</span>
          <select 
            className="flex-1 bg-gray-900 border border-gray-700 text-white text-xs rounded p-1 custom-select focus:ring-green-500"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar" ref={scrollRef}>
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
            <MessageSquare size={32} className="mb-2 opacity-50" />
            <p className="text-center text-sm">Transcript will appear here as people speak...</p>
            <p className="text-center text-xs mt-2 text-gray-500">Ensure microphone permissions are enabled for transcription.</p>
          </div>
        ) : (
          transcript.map(entry => {
            const isMe = entry.speakerName === (localParticipant?.name || localParticipant?.userId || 'Me');
            
            return (
              <div key={entry.id} className="mb-4 group relative">
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span className={`font-medium ${isMe ? 'text-green-400' : 'text-blue-400'}`}>
                    {entry.speakerName}
                  </span>
                  <span>{formatTime(entry.timestamp)}</span>
                </div>
                
                {editingId === entry.id ? (
                  // Edit UI for own messages
                  <div className="mt-1 bg-gray-800 p-2 rounded-md border border-gray-600">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="mb-2 h-8 text-sm bg-gray-900 border-gray-700 text-white focus-visible:ring-green-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-300 hover:text-white hover:bg-gray-700" onClick={() => setEditingId(null)}>Cancel</Button>
                      <Button size="sm" className="h-7 text-xs bg-green-700 hover:bg-green-600 text-white" onClick={handleSaveEdit}>Save</Button>
                    </div>
                  </div>
                ) : correctingId === entry.id ? (
                  // Correction UI for others' messages (Teacher mode)
                  <div className="mt-1 bg-yellow-900/30 p-2 rounded-md border border-yellow-700">
                    <div className="text-xs text-yellow-500 mb-1 font-medium flex items-center gap-1">
                      <PenLine size={12} /> Propose Correction
                    </div>
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="mb-2 h-8 text-sm bg-gray-900 border-yellow-700 text-white focus-visible:ring-yellow-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveCorrection();
                        if (e.key === 'Escape') setCorrectingId(null);
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-300 hover:text-white hover:bg-gray-700" onClick={() => setCorrectingId(null)}>Cancel</Button>
                      <Button size="sm" className="h-7 text-xs bg-yellow-600 hover:bg-yellow-500 text-white" onClick={handleSaveCorrection}>Send</Button>
                    </div>
                  </div>
                ) : (
                  // Normal display
                  <div className="relative group/bubble">
                    <div className={`mt-1 text-sm bg-gray-800 p-2.5 rounded-lg border transition-colors break-words ${isMe ? 'hover:border-gray-600 border-transparent cursor-pointer' : 'border-transparent'}`}
                      onClick={() => {
                        if (isMe) handleEditStart(entry);
                      }}
                      title={isMe ? "Click to edit" : undefined}
                    >
                      <p>
                        {entry.text}
                        {entry.edited && <span className="text-[10px] text-gray-500 ml-1.5 italic">(edited)</span>}
                      </p>
                      
                      {/* Teacher Correction Overlay */}
                      {entry.correction && (
                        <div className="mt-2 p-1.5 bg-yellow-900/40 rounded border border-yellow-800/50 flex flex-col gap-0.5">
                          <span className="text-[10px] text-yellow-500 font-semibold uppercase flex items-center gap-1">
                            <CheckCircle2 size={10} /> Correction
                          </span>
                          <span className="text-sm text-yellow-100">{entry.correction}</span>
                        </div>
                      )}
                      
                      {/* Translated Subtitle */}
                      {entry.translatedText && (
                        <p className="mt-1 text-xs text-green-300 italic">
                          {entry.translatedText}
                        </p>
                      )}
                    </div>

                    {/* Quick Action Buttons (Show on hover) */}
                    <div className="absolute -right-2 -top-3 hidden group-hover/bubble:flex items-center gap-1 bg-gray-700 rounded-md border border-gray-600 shadow-lg p-0.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSaveToVocab(entry); }}
                        className="p-1 hover:bg-gray-600 rounded text-gray-300 hover:text-green-400 transition-colors"
                        title="Save to Vocabulary"
                      >
                        <Bookmark size={14} />
                      </button>
                      
                      {!isMe && !entry.correction && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCorrectionStart(entry); }}
                          className="p-1 hover:bg-gray-600 rounded text-gray-300 hover:text-yellow-400 transition-colors"
                          title="Correct Grammar"
                        >
                          <PenLine size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <div className="p-3 border-t border-gray-700 flex justify-end bg-gray-800">
        <Button 
          size="sm" 
          className="bg-green-700 hover:bg-green-600 text-white transition-colors"
          onClick={saveTranscriptToFile}
          disabled={transcript.length === 0}
        >
          <Save size={16} className="mr-1.5" />
          Export Lesson Notes
        </Button>
      </div>
    </div>
  );
};

export default TranscriptPanel; 