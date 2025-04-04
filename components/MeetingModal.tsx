"use client"
import React, { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';


interface MeetingModalProps {
     isOpen: boolean; 
     onClose: () => void;
     title: string;
     className?: string; 
     children?: ReactNode; 
     handleClick?: () => void,
     buttonText: string;
     image?: string;
     buttonIcon?: string;
}

const MeetingModal = ({
    isOpen, onClose, title, className, children, handleClick, buttonText, image, buttonIcon}: MeetingModalProps) => {
  return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='flex w-full max-w-[520px] flex-col border-none bg-white px-6 py-9'>
               <div className='flex flex-col justify-center gap-6'>
                <h3 className='font-bold text-xl'>{title}</h3>
                <p className='text-sm text-[#4b5563]'>{children}</p>
                <Button onClick={handleClick} className='bg-[#506674ff] text-white hover:bg-[#506674ff] focus:ring-2 focus:ring-[#506674ff] focus:ring-offset-2 p-2'>
                  {buttonText}
                </Button>
               </div>
            </DialogContent>
         </Dialog>
  )
}

export default MeetingModal