"use client";

import { Check, Copy, LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { format } from "date-fns";

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
    <section className="flex w-full flex-col gap-2 rounded-xl p-2 xl:max-w-1/2 bg-[#629175] text-white ">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="meeting-image" width={28} height={28} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2 truncate">
            <h4 className="text-xl font-bold truncate">{title}</h4>
            <p className="text-sm font-normal">{meetingDate}</p>
          </div>
        </div>
      </article>
      <article className="flex justify-center">
        {!isPreviousMeeting && (
          <div className="flex gap-4 mt-5">
            <Button onClick={handleClick}>
              {ButtonIcon && <ButtonIcon className="size-4 mr-2" />}
              {buttonText}
            </Button>
            <Button onClick={onCopy} variant={"secondary"} disabled={copied}>
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
      </article>
    </section>
  );
};

export default CallCard;