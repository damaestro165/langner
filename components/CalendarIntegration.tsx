"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, X, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarEvent, createAppleCalendarEvent, createGoogleCalendarEvent, createOutlookCalendarEvent } from '@/lib/calendarIntegration';

type Meeting = {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  participants: string[];
};

const CalendarIntegration = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Spanish Conversation Practice',
      description: 'Weekly conversation practice with Maria',
      startTime: new Date(Date.now() + 86400000), // Tomorrow
      endTime: new Date(Date.now() + 86400000 + 3600000), // Tomorrow + 1 hour
      participants: ['maria@example.com'],
    },
    {
      id: '2',
      title: 'French Grammar Review',
      description: 'Review of past tense with Jean',
      startTime: new Date(Date.now() + 172800000), // Day after tomorrow
      endTime: new Date(Date.now() + 172800000 + 3600000), // Day after tomorrow + 1 hour
      participants: ['jean@example.com'],
    },
  ]);
  
  const [isAddingMeeting, setIsAddingMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000), // 1 hour from now
    participants: [],
  });
  
  const addMeeting = () => {
    if (!newMeeting.title) return;
    
    setMeetings(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newMeeting.title!,
        description: newMeeting.description,
        startTime: newMeeting.startTime!,
        endTime: newMeeting.endTime!,
        participants: newMeeting.participants!,
      },
    ]);
    
    setIsAddingMeeting(false);
    setNewMeeting({
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      participants: [],
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const exportToCalendar = (meeting: Meeting, provider: 'google' | 'apple' | 'outlook') => {
    const calendarEvent: CalendarEvent = {
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      attendees: meeting.participants,
    };
    
    let url = '';
    switch (provider) {
      case 'google':
        url = createGoogleCalendarEvent(calendarEvent);
        break;
      case 'apple':
        url = createAppleCalendarEvent(calendarEvent);
        break;
      case 'outlook':
        url = createOutlookCalendarEvent(calendarEvent);
        break;
    }
    
    // Open the calendar URL in a new tab
    window.open(url, '_blank');
  };

  return (
    <>
      <Button
        onClick={() => setShowCalendar(true)}
        className="fixed right-4 bottom-44 rounded-full p-3 bg-purple-600 text-white"
        title="Calendar"
      >
        <Calendar size={20} />
      </Button>
      
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Meeting Schedule</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Upcoming Meetings</h3>
              <Button 
                size="sm" 
                onClick={() => setIsAddingMeeting(true)}
              >
                <Plus size={16} className="mr-1" /> New Meeting
              </Button>
            </div>
            
            {meetings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon size={48} className="mx-auto mb-2 opacity-20" />
                <p>No upcoming meetings</p>
                <p className="text-sm">Create your first language learning meeting</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="border rounded-md p-3">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{meeting.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Add to Calendar
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => exportToCalendar(meeting, 'google')}>
                            Google Calendar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportToCalendar(meeting, 'apple')}>
                            Apple Calendar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportToCalendar(meeting, 'outlook')}>
                            Outlook Calendar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Clock size={14} className="mr-1" />
                      <span>
                        {formatDate(meeting.startTime)} - {formatDate(meeting.endTime)}
                      </span>
                    </div>
                    
                    {meeting.description && (
                      <p className="text-sm mt-2">{meeting.description}</p>
                    )}
                    
                    <div className="text-sm mt-2">
                      <span className="text-gray-500">Participants: </span>
                      {meeting.participants.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddingMeeting} onOpenChange={setIsAddingMeeting}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Meeting</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={newMeeting.title}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Spanish Conversation Practice"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={newMeeting.description}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What will you do in this meeting?"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Input 
                  type="datetime-local"
                  value={newMeeting.startTime?.toISOString().slice(0, 16)}
                  onChange={(e) => setNewMeeting(prev => ({ 
                    ...prev, 
                    startTime: new Date(e.target.value) 
                  }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">End Time</label>
                <Input 
                  type="datetime-local"
                  value={newMeeting.endTime?.toISOString().slice(0, 16)}
                  onChange={(e) => setNewMeeting(prev => ({ 
                    ...prev, 
                    endTime: new Date(e.target.value) 
                  }))}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Participants (comma-separated emails)</label>
              <Input 
                value={newMeeting.participants?.join(', ')}
                onChange={(e) => setNewMeeting(prev => ({ 
                  ...prev, 
                  participants: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                }))}
                placeholder="e.g. john@example.com, maria@example.com"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingMeeting(false)}>
                Cancel
              </Button>
              <Button onClick={addMeeting} disabled={!newMeeting.title}>
                Add Meeting
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarIntegration; 