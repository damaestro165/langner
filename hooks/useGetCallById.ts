import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCallById = (id: string) => {
 const [call, setCall] = useState<Call | null>(null)
 const [isCallLoading, setIsCallLoading] = useState(true)
 const [error, setError] = useState<Error | null>(null)
 const client = useStreamVideoClient();

 useEffect(() => {
    if(!client) return;
    const loadCall = async () => {
        try {
            const {calls} = await client.queryCalls({
                filter_conditions: {
                    id: id // Ensure single string ID
                }
            })
            
            if (calls.length > 0) {
                setCall(calls[0]);
            } else {
                setError(new Error('No call found'));
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load call'));
        } finally {
            setIsCallLoading(false)
        }
    }
    loadCall();
 }, [client, id]);
 
 return { call, isCallLoading, error }
}