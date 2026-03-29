"use client";

import { Check, Copy, LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { format } from "date-fns";
import Icon from "./DynamicIcon";
import { cn } from "@/lib/utils";

interface CallCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  ButtonIcon?: LucideIcon;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const CallCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  ButtonIcon,
  handleClick,
  link,
  buttonText,
}: CallCardProps) => {
  const [copied, setCopied] = useState(false);

  const meetingDate = format(new Date(date), "yyyy/MM/dd h:mm a");

  const onCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="flex w-full flex-col gap-5 rounded-[32px] p-8 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[64px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
      
      <article className="flex flex-col gap-6 relative z-10">
        <div className="flex justify-between items-start">
          <div className='flex bg-emerald-50 text-emerald-600 rounded-2xl p-3 w-fit'>
            <Image src={icon} alt="meeting-icon" width={24} height={24} className="opacity-80" />
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className={cn(
               "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
               isPreviousMeeting ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
            )}>
               {isPreviousMeeting ? "Completed" : "Scheduled"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h4>
          
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-gray-400">
               <Icon name="Calendar" className="w-3.5 h-3.5" />
               <span className="text-xs font-medium">{format(new Date(date), "EEE, MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
               <Icon name="Clock" className="w-3.5 h-3.5" />
               <span className="text-xs font-medium">{format(new Date(date), "h:mm a")} - {format(new Date(new Date(date).getTime() + 3600000), "h:mm a")}</span>
            </div>
          </div>
        </div>
      </article>

      {!isPreviousMeeting && (
        <div className="flex gap-3 mt-2 relative z-10">
          <Button 
            onClick={handleClick}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 font-bold transition-all shadow-sm active:scale-95"
          >
            {ButtonIcon && <ButtonIcon className="size-4 mr-2" />}
            {buttonText}
          </Button>
          <Button 
            onClick={onCopy} 
            variant="outline" 
            disabled={copied}
            className="flex-1 border-emerald-100 text-emerald-700 hover:bg-emerald-50 rounded-xl py-6 font-bold transition-all"
          >
            {!copied ? (
              <>
                <Copy className="size-4 mr-2" />
                Copy Link
              </>
            ) : (
              <>
                <Check className="size-4 mr-2" />
                Copied!
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
};

export default CallCard;