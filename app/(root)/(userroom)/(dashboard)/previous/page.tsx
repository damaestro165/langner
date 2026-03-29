import CallList from '@/components/CallList'
import React from 'react'

const Previous = () => {
  return (
    <section className='flex size-full flex-col gap-12 pb-12'>
      <div className="flex flex-col gap-2">
        <h1 className='text-5xl font-extrabold text-gray-900 tracking-tight'>
          Previous Meetings
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          Review your past sessions, access recorded materials, and track your learning progress.
        </p>
      </div>

      <CallList type="ended"/>

      {/* Breakthrough CTA Section */}
      <div className="mt-12 relative overflow-hidden rounded-[40px] bg-emerald-950 p-12 flex flex-col md:flex-row items-center justify-between gap-12 group">
        <div className="flex flex-col gap-6 max-w-xl relative z-10">
          <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
            Ready for your next breakthrough?
          </h2>
          <p className="text-emerald-100/70 text-lg font-medium leading-relaxed">
            Continue your progress with your favorite tutor or explore new learning resources in the library.
          </p>
          <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-400 text-white w-fit px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
            Start Lesson <Icon name="ChevronRight" className="w-5 h-5" />
          </Link>
        </div>

        <div className="relative w-full md:w-[400px] h-[300px] relative z-10 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2">
          <Image 
            src="/images/learning_resources.png" 
            alt="Learning Resources" 
            fill 
            className="object-contain"
          />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-2xl" />
      </div>
    </section>
  )
}

export default Previous