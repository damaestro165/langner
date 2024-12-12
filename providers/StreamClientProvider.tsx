"use client";

import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const { isAuthenticated, user } = useKindeBrowserClient();

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        if (!apiKey) {
            console.error('Stream API key is missing. Ensure NEXT_PUBLIC_STREAM_API_KEY is set.');
            throw new Error('Stream API key missing');
        }

        const client = new StreamVideoClient({
            apiKey,
            user: {
                id: user?.id || 'default-id',
                name: user?.given_name || user?.id || 'Anonymous',
                image: user?.picture || '',
            },
            tokenProvider,
        });
        setVideoClient(client);
    }, [user, isAuthenticated]);

    if (!isAuthenticated) return <Loader />;
    if (!videoClient) return <Loader />;

    return (
        <StreamVideo client={videoClient}>
            {children}
        </StreamVideo>
    );
};

export default StreamVideoProvider;
