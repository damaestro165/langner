import React from 'react';
import MeetingTypeList from '@/components/MeetingTypeList';

const DashboardHome = () => {
  const now = new Date();

  // Get formatted date and time
  const date = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(now);
  
  const time = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <section className='flex flex-col gap-8 w-full pb-10'>
      <div className='relative h-[340px] w-full rounded-[32px] overflow-hidden shadow-2xl group transition-all duration-700'>
        {/* Hero Background with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: "url('/images/hero_bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-transparent" />
        
        <div className='relative h-full flex flex-col justify-between p-12 text-white'>
          <div className='flex items-center gap-2'>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className='text-xs font-bold tracking-widest uppercase text-emerald-100/80'>
              Class in progress
            </h2>
          </div>
          
          <div className='flex flex-col gap-1'>
            <h1 className='text-7xl font-black tracking-tighter drop-shadow-lg leading-none'>
              {time}
            </h1>
            <p className="text-xl font-medium text-emerald-50/90">{date}</p>
          </div>

          {/* Up Next Preview Card Overlay */}
          <div className="absolute top-12 right-12 w-64 glassmorphism p-6 rounded-2xl border border-white/20 backdrop-blur-md bg-white/10 shadow-xl">
             <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 mb-2">Up Next</p>
             <h3 className="text-lg font-bold leading-tight mb-1">Advanced Phonetics</h3>
             <p className="text-xs text-white/80">10:30 AM — 11:30 AM</p>
          </div>
        </div>
      </div>
      
      <div className='w-full'>
        <MeetingTypeList/>
      </div>
    </section>
  );
};

export default DashboardHome;