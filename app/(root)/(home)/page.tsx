import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import Icon from '@/components/DynamicIcon';
import Link from 'next/link';

const Home = () => {
  return (
    <main className='flex flex-col w-full bg-white'>
      {/* Hero Section */}
      <section className='max-w-7xl mx-auto w-full flex flex-col items-center pt-12 lg:pt-24 px-8 gap-16 text-center'>
        <div className='flex flex-col items-center gap-10 w-full max-w-4xl'>
          <div className='flex flex-col gap-6 items-center'>
            <h1 className='text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight'>
              Experience Immersive <br/>
              <span className='text-emerald-500 italic'>Language Learning</span> <br/>
              through Live Meetings.
            </h1>
            <p className='text-xl text-gray-500 font-medium max-w-2xl leading-relaxed'>
              Join Interactive Meetings led by Native Speakers Anytime, Anywhere. Break barriers and speak with confidence from day one.
            </p>
          </div>

          <div className='flex items-center gap-6'>
            <RegisterLink>
              <Button className='bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-7 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-700/20 active:scale-95 transition-all'>
                Get Started
              </Button>
            </RegisterLink>
            <LoginLink>
              <Button variant='secondary' className='bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-10 py-7 rounded-2xl font-bold text-lg border-none active:scale-95 transition-all'>
                Log In
              </Button>
            </LoginLink>
          </div>

          <div className='flex gap-16 pt-4 justify-center'>
            <div className="flex flex-col gap-1">
              <h2 className='text-3xl font-black text-gray-900'>20K+</h2>
              <p className='text-sm font-bold uppercase tracking-widest text-gray-400'>Active Users</p>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className='text-3xl font-black text-gray-900'>2+</h2>
              <p className='text-sm font-bold uppercase tracking-widest text-gray-400'>Nigeria & Ghana</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Composition */}
        <div className='w-full max-w-5xl relative mt-10'>
           <div className="relative z-10 rounded-[48px] overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-700">
              <Image src="/images/landing_hero.png" alt="Student" width={600} height={600} className="w-full h-auto" />
              <div className="absolute bottom-6 left-6 glassmorphism bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/40 shadow-xl">
                 <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                    <Icon name="Video" className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">Live Session</p>
                    <p className="text-[10px] text-gray-500">Spanish Intermediate</p>
                 </div>
              </div>
           </div>

           {/* Floating Avatar Card */}
           <div className="absolute -top-10 -right-10 z-20 hidden xl:block animate-bounce shadow-2xl rounded-[32px] overflow-hidden">
              <div className="bg-gray-900 p-4 w-40 h-40 flex flex-col justify-end">
                 <Image src="/images/landing_avatar.png" alt="Tutor" width={160} height={160} className="absolute inset-0 object-cover" />
                 <div className="relative bg-white/90 backdrop-blur-md p-2 rounded-xl flex items-center gap-2 border border-white/20">
                    <div className="flex -space-x-2">
                       <div className="w-4 h-4 rounded-full bg-emerald-400 border border-white" />
                       <div className="w-4 h-4 rounded-full bg-blue-400 border border-white" />
                    </div>
                    <p className="text-[8px] font-bold">Joining now...</p>
                 </div>
              </div>
           </div>

           {/* Dialects Card */}
           <div className="absolute -bottom-8 -right-8 z-20 hidden xl:block group">
              <div className="bg-emerald-800 p-8 rounded-[32px] shadow-2xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-105">
                 <Icon name="Globe" className="text-emerald-100 w-8 h-8 mb-4 opacity-50" />
                 <p className="text-2xl font-black text-white">15+ Native Dialects</p>
              </div>
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='w-full min-h-screen bg-emerald-50/30 py-32 mt-20'>
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
           <div className="text-center max-w-2xl mb-20">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                 Master any language <br/>
                 <span className="text-emerald-500">with precision.</span>
              </h2>
              <p className="text-lg text-gray-500 font-medium">
                 Our method combines cultural immersion with expert-led real-time feedback to accelerate your fluency.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                 { title: "Small Group Sessions", desc: "Max 4 students per session ensures personalized attention and maximum speaking time.", icon: "Users" },
                 { title: "Learn Anytime", desc: "Classes available 24/7. Simply pick a time that fits your schedule and start learning.", icon: "Clock" },
                 { title: "Certified Tutors", desc: "Every tutor is a vetted native speaker with teaching certifications and a passion for education.", icon: "ShieldCheck" }
              ].map((feature, i) => (
                 <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="bg-emerald-50 text-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:rotate-3">
                       <Icon name={feature.icon as any} className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-extrabold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="max-w-7xl mx-auto w-full px-8 py-20 pb-32">
         <div className="bg-gray-950 rounded-[48px] p-16 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden group">
            <div className="flex flex-col gap-8 max-w-xl relative z-10">
               <h2 className="text-6xl lg:text-7xl font-black text-white leading-none tracking-tighter">
                  Ready to start <br/>
                  your journey?
               </h2>
               <p className="text-gray-400 text-lg font-medium leading-relaxed">
                  Join over 20,000 students globally and start speaking fluently in as little as 3 months.
               </p>
               <RegisterLink>
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-7 rounded-2xl font-extrabold text-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                     Book Your Free Class
                  </Button>
               </RegisterLink>
            </div>

            <div className="lg:w-1/2 flex flex-wrap gap-4 justify-center items-center relative z-10 transition-transform duration-700 group-hover:scale-105">
               <div className="w-48 h-32 bg-emerald-900/40 rounded-3xl border border-white/5" />
               <div className="w-40 h-40 bg-gray-900 rounded-3xl border border-white/5 flex items-center justify-center p-4">
                  <div className="w-full h-full bg-emerald-800/20 rounded-2xl border border-emerald-500/10" />
               </div>
               <div className="w-full h-40 bg-emerald-700/80 rounded-3xl border border-white/10 flex items-center justify-center">
                  <Icon name="GraduationCap" className="w-16 h-16 text-white" />
               </div>
               <div className="w-48 h-32 bg-gray-900 rounded-3xl border border-white/5" />
            </div>

            {/* Decorative background gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -mr-64 -mt-64 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-[100px]" />
         </div>
      </section>

      {/* Footer Branding */}
      <footer className="w-full border-t border-gray-100 py-12 bg-gray-50/50">
         <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2">
                  <Image src='/icons/logo.svg' alt="Langner" width={24} height={24}/>
                  <span className="font-extrabold text-xl text-gray-900">Langner</span>
               </div>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2024 Langner. The Modern Scholar&apos;s Choice.</p>
            </div>
            
            <div className="flex gap-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               <span>© 2024 Langner. The Modern Scholar&apos;s Choice.</span>
               <span>© 2024 Langner. The Modern Scholar&apos;s Choice.</span>
               <span>© 2024 Langner. The Modern Scholar&apos;s Choice.</span>
            </div>
         </div>
      </footer>
    </main>
  )
}

export default Home