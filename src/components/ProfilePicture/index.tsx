'use client'

import { stringToColor } from '@/lib/helpers';
import { useTronStore } from '@/lib/states';
import { useEffect, useState } from 'react';

export default function ProfilePicture({ address } : { address: string }) {

    const kinDao = useTronStore(state => state.kinDao);
    const [avatar, setAvatar] = useState<string>("");

    useEffect(() => {
        if (kinDao?.getProfile) {
            (async() => {
                const profile = await kinDao.getProfile(address);
                setAvatar(profile?.avatarUrl || "");
            })()
        }
    }, [kinDao])

    return (
        <div
            className="pfp"
            style={ !avatar ? (
                {
                    background: `linear-gradient(45deg, ${stringToColor(address)}, #2b0107)`
                }) : ({
                    backgroundImage: `url('${avatar}')`,
                    background: `#000`
                })
            }
        ></div>
    )
}