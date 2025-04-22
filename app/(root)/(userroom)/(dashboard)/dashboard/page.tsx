import React from 'react';
import MeetingTypeList from '@/components/MeetingTypeList';
const DashboardHome = () => {
  const now = new Date();

  // Get formatted date and time
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now);
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Get client's time zone abbreviation
  const timeZoneFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  const timeZoneParts = timeZoneFormatter.formatToParts(now);
  const timeZoneAbbr = timeZoneParts.find(part => part.type === 'timeZoneName')?.value || '';

  return (
    <section className='flex flex-col lg:flex-row h-full gap-3 w-full '>
      <div className='w-full lg:w-1/2 flex-col gap-5'>
        <div className=' h-[18rem] bg-hero bg-cover rounded-lg lg:rounded-2xl mb-2'>
          <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
            <h2 className='bg-green-100 w-fit p-2 text-green-800'>
              {timeZoneAbbr}
            </h2>
            <div className='flex flex-col gap-2 text-green-800'>
              <h2 className='text-3xl font-extrabold lg:text-5xl'>
                {time}
              </h2>
              <p>{date}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='lg:bg-gray-100 lg:w-1/2 h-fit rounded-2xl '>
        <MeetingTypeList/>
      </div>
    </section>
  );
};

export default DashboardHome;