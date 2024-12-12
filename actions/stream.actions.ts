"use server"

import { StreamClient } from '@stream-io/node-sdk';

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const { getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user) throw new Error('User is not logged in');
    if(!apiKey) throw new Error('No API Key');
    if(!apiSecret) throw new Error('no API secret');

    const client = new StreamClient(apiKey, apiSecret)
    const validity = 60 * 60;
    const token = client.generateUserToken({ user_id: user.id, validity_in_seconds: validity });
    
    console.log('Stream token:', token); 

    return token;
   
}