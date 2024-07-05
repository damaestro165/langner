import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'


const Home = () => {
  return (
    <main >
      <section className='flex gap-0 items-center'>
       <div className='flex px-24 gap-5 flex-col w-2/3'>
         <div className='flex gap-5  flex-col'>
          <h1 className='text-5xl font-bold'>
            Experience <span className=' text-green-700' > Language
               Learning</span>  through Live Meetings
          </h1>
          <p className='font-[400] text-sm'>Join Interactive Meetings led by Native Speakers Anytime, Anywhere</p>
        </div>
        <div className='flex gap-5'>
          <Button className='bg-green-700 w-44 '> Get Started</Button>
          <Button variant='outline' className='border border-green-700 w-44 '> Log In</Button>
        </div>
         <div className='flex gap-16'>
         <div>
          <h2 className='text-4xl'>20K+</h2>
          <p className='text-sm'>Active users</p>
         </div>
         <div>
          <h2 className='text-4xl'>2+</h2>
          <p className='text-mm'>Available in Nigeria and Ghana</p>
         </div>
          
        </div>
       </div>
       <div className='grid w-1/2 gap-4 grid-cols-5 mt-5 -ml-40'>
      
        {/* <Image src="/image/heroimageone.jpeg" alt='heroimage' width={350} height={150} className=' rounded-md w-60 col-span-4 col-start-2 border border-black' />
        <Image src="/image/heroimagetwo.jpeg" alt='heroimage' width={250} height={150} className=' rounded-md col-span-2 h-60 border border-black '  />
        <Image src="/image/heroimagethree.jpeg" alt='heroimage' width={250} height={150} className=' rounded-md col-span-2 border border-black  ' /> */}
       </div>
      </section>
      <section></section>
    </main>
  )
}

export default Home