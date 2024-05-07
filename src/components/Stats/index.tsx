'use client'

import { useState, useEffect } from "react";
import { useTronStore } from "@/lib/states";
import type { Totals } from "@/lib/kindao";

export default function Stats() {

    const kinDao = useTronStore(state => state.kinDao);
    const [stats, setStats] = useState<Totals | null>(null);

    useEffect(() => {
        if (kinDao?.getTotals) {
            (async() => {
                const stats_ = await kinDao.getTotals();
                setStats(stats_);
            })()
        }
    }, [kinDao])

    return (
        <div className="stats">
            <h4>Total Proposals</h4>
            <p>{stats?.proposal || 0}</p>
            <h4>Total Facts</h4>
            <p>{stats?.fact || 0}</p>
            <h4>Earned KDAO Tokens</h4>
            <p>{stats?.tokenAmount || 0}</p>
            <h4>Total Profiles</h4>
            <p>{stats?.profile || 0}</p>
            <h4>Total Votes</h4>
            <p>{stats?.vote || 0}</p>
        </div>
    )
}