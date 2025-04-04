"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-start gap-2 xl:flex-row">
    <h3 className="text-base font-medium text-sky-1 lg:text-xl">{title}:</h3>
    <h4 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
      {description}
    </h4>
  </div>
);

const PersonalRoomPage = () => {
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const [copied, setCopied] = useState(false);
  const client = useStreamVideoClient();
  const {toast} = useToast()

  const meetingId = user?.id;

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;
    try {
      const newCall = client.call("default", meetingId!);

      if (!call) {
        await newCall.getOrCreate({
          data: {
            starts_at: new Date().toISOString(),
          },
        });
      }

      router.push(`/meeting/${meetingId}?personal=true`);
    } catch (error) {
      toast({title:"Failed to create meeting!"});
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

  const onCopy = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="size-full flex flex-col gap-10 ">
      <h2 className="text-3xl font-bold">Personal Room</h2>
      <div className="flex w-full flex-col gap-8 xl:max-w-4xl overflow-hidden">
        <Table
          title="Topic"
          description={`${user?.given_name} ${user?.family_name}'s Meeting Room`}
        />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button onClick={startRoom}>Start Meeting</Button>
        <Button
          variant={"secondary"}
          onClick={onCopy}
          disabled={copied}
          className="transition duration-300"
        >
          {copied ? (
            <>
              Copied <Check className="size-4 ml-2" />
            </>
          ) : (
            <>
              Copy Invitation
              <Copy className="size-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoomPage;