'use client'

import DataTable from 'react-data-table-component';
import { Profile } from '@/lib/kindao';

import './leaderboard.scss';
import { useTronStore } from '@/lib/states';
import { useEffect, useState } from 'react';

export default function Leaderboard() {

    const kinDao = useTronStore(state => state.kinDao);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    useEffect(() => {
        if (kinDao?.getProfiles) {
            (async() => {
                const profiles = await kinDao.getProfiles();
                setProfiles(profiles?.length ? profiles : []);
            })()
        }
    }, [kinDao])

    return (
        <div id="leaderboard">
            <h2>Leaderboard</h2>
            <p>The most successful fact-checkers</p>

            <DataTable
                columns={[
                    {
                        name: "Username",
                        selector: row => (row as Profile).username,
                    },
                    {
                        name: "Earning",
                        selector: row => (row as Profile).earned,
                    },
                    {
                        name: "Go to Profile",
                        cell: row => <a href={`/profile/${(row as Profile).owner}`}>Go to Profile</a>
                    }
                ]}
                data={profiles}
            />
        </div>
    )
}