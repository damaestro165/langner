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
            <DialogContent>
               <div>
                <Button onClick={handleClick}>
                  Start Meeting
                </Button>
               </div>
            </DialogContent>
         </Dialog>
  )
}

export default MeetingModal