import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'


const Home = () => {
  return (
    <main  className='flex flex-col lg:px-0'>
      <section className=' w-full flex flex-col-reverse lg:flex-row lg:items-center mt-5 lg:px-20 xl:px-24 justify-center gap-5 xl:gap-0 '>
       <div className='flex flex-col justify-center   px-4 w-full gap-4  lg:p-0  lg:w-1/2'>
         <div className='flex gap-6 lg:gap-5 flex-col'>
          <h1 className='text-2xl lg:text-4xl lg:pr-8 xl:text-5xl xl:leading-[3.5rem] font-bold xl:pr-6'>
            Experience Immersive <span className=' text-green-700' > Language
               Learning</span>  through Live Meetings
          </h1>
          <p className='font-[400] text-sm'>Join Interactive Meetings led by Native Speakers Anytime, Anywhere</p>
        </div>
        <div className='flex gap-6 lg:gap-5'>
          <Button className='bg-green-700 w-36 lg:w-44 '> Get Started</Button>
          <Button variant='outline' className='border border-green-700 w-36 lg:w-44 '> Log In</Button>
        </div>
         <div className='flex gap-16'>
         <div>
          <h2 className=' text-2xl lg:text-4xl'>20K+</h2>
          <p className='text-sm'>Active users</p>
         </div>
         <div>
          <h2 className=' text-2xl lg:text-4xl'>2+</h2>
          <p className='text-mm'>Available in Nigeria and Ghana</p>
         </div>
          
        </div>
       </div>
       <div className='lg:grid hidden lg:w-1/2 gap-4 grid-cols-4 xl:mr-2'>
       <div className='border rounded-md w-full h-56 border-black col-span-3 col-start-2 bg-[url("/image/heroimageone.jpeg")] bg-cover bg-center'></div>
       <div className='border rounded-md w-full h-48 border-black col-span-2 bg-[url("/image/heroimagetwo.jpeg")] bg-cover bg-center'></div>
       <div className='border rounded-md w-full h-32 border-black col-span-2 bg-[url("/image/heroimagethree.jpeg")] bg-cover bg-center'></div>
       </div>
      </section>
     
    </main>
  )
}

export default Home