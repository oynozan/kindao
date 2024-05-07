'use client'

import DataTable from 'react-data-table-component';
import { leaderboard, type Leaderboard } from '@/data/dummy/leaderboard';

import './leaderboard.scss';

export default function Leaderboard() {
    return (
        <div id="leaderboard">
            <h2>Leaderboard</h2>
            <p>The most successful fact-checkers</p>

            <DataTable
                columns={[
                    {
                        name: "Username",
                        selector: row => (row as Leaderboard).username,
                    },
                    {
                        name: "Earning",
                        selector: row => (row as Leaderboard).earned,
                    },
                ]}
                data={leaderboard}
            />
        </div>
    )
}