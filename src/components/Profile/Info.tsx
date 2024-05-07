'use client'

import { useTronStore } from '@/lib/states';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { FaAward } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";

import ProfilePicture from "@/components/ProfilePicture";

export default function ProfileInfo({ address }: { address: string }) {

    const router = useRouter();

    const kinDao = useTronStore(state => state.kinDao);
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        if (kinDao?.getProfile) {
            (async() => {
                const profile = await kinDao.getProfile(address);
                if (!profile?.username) router.push("/404");
                setBalance(profile?.earned || 0);
            })()
        }
    }, [kinDao])

    return (
        <div className="head">
            <div className="pfp-container">
                <ProfilePicture address={address} />
            </div>
            <div className="info">
                <a
                    className="address"
                    href={"https://tronscan.org/#/address/" + address}
                    target="_blank"
                >
                    {address}
                    <FaShareFromSquare />
                </a>
                <p className="balance">
                    { balance.toFixed(2) }
                    <FaAward />
                </p>
            </div>
        </div>
    )
}