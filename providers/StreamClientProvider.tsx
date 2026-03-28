"use client";

import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, user } = useKindeBrowserClient();

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        
        if (!apiKey) {
            console.error('Stream API key is missing. Ensure NEXT_PUBLIC_STREAM_API_KEY is set.');
            setError('Stream API key missing');
            return;
        }

        const initClient = async () => {
            try {
                // Check user properties
                if (!user.id) {
                    console.error('User ID is missing from Kinde authentication');
                    setError('User ID is missing');
                    return;
                }

                // Get token first
                let token;
                try {
                    token = await tokenProvider();
                    console.log('Token fetched successfully');
                } catch (tokenError) {
                    console.error('Failed to fetch Stream token:', tokenError);
                    setError('Authentication failed');
                    return;
                }

                // Create client with the token already obtained
                const client = new StreamVideoClient({
                    apiKey,
                    user: {
                        id: user.id,
                        name: user?.given_name || user.id || 'Anonymous',
                        image: user?.picture || '',
                    },
                    token, // Use the fetched token directly
                });

                // Test the connection
                await client.connectUser();
                console.log('Stream client connected successfully');
                
                setVideoClient(client);
                setError(null);
            } catch (err) {
                console.error('Failed to initialize Stream client:', err);
                setError(err instanceof Error ? err.message : 'Unknown error initializing Stream client');
            }
        };

        initClient();

        // Cleanup function
        return () => {
            if (videoClient) {
                videoClient.disconnectUser();
                console.log('Stream client disconnected');
            }
        };
    }, [user, isAuthenticated]);

    if (!isAuthenticated) return <Loader />;
    
    if (error) {
        return (
            <div className="flex h-screen items-center justify-center flex-col">
                <p className="text-red-500 mb-2">Error: {error}</p>
                <p>Please refresh the page or contact support.</p>
            </div>
        );
    }
    
    if (!videoClient) return <Loader />;

    return (
        <StreamVideo client={videoClient}>
            {children}
        </StreamVideo>
    );
};

export default StreamVideoProvider;
