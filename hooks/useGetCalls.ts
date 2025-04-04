import Upcoming from "@/app/(root)/(userroom)/(dashboard)/upcoming/page"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCall = () => {
 const [calls, setCalls] = useState<Call[]>([])
 const [isLoading, setIsLoading] = useState(false)
 const client = useStreamVideoClient();
  const {user} = useKindeBrowserClient();

 useEffect(() => {
    const loadCalls = async () => {
        if(!client || !user) return;
        setIsLoading(true);
        try {
            const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });
        
        setCalls(calls);
          
        } catch (err) {
            console.error(err instanceof Error ? err : 'Failed to load calls');
        } finally {
            setIsLoading(false)
        }
    }
    loadCalls();
 }, [client, user?.id]);

    const now = new Date();

    const endedCalls = calls.filter(({state: {startsAt, endedAt}}: Call) => { 
    return (startsAt && new Date(startsAt) < now || !!endedAt)})

    const UpcomingCalls =  calls.filter(({state: {startsAt}}: Call) => { 
    return (startsAt && new Date(startsAt) > now)})
 
 return { endedCalls, UpcomingCalls, isLoading, callRecordings:calls }
}