'use client'

import { useEffect, useState } from 'react';
import { FaAward } from 'react-icons/fa';

import { Proposal } from '@/lib/kindao';
import { useTronStore } from '@/lib/states';
import { formatDate, truncateWalletAddress } from '@/lib/helpers';

export default function PostComponent({ id } : { id: string }) {

    const kinDao = useTronStore(state => state.kinDao);
    const [proposal, setProposal] = useState<Proposal | null>(null);

    useEffect(() => {
        if (kinDao) {
            (async() => {
                const proposal = await kinDao.getProposal(id);
                console.log(proposal)
                if (proposal)  {
                    setProposal(proposal);
                }
            })()
        }
    }, [kinDao])

    return (
        <div id="post">
            <div className="info">
                <h1>{proposal?.title || ""}</h1>
                <div className="bounty">{(proposal?.bounty || 0).toFixed(2)}<FaAward /></div>
            </div>

            <p>{proposal?.description || ""}</p>

            <div className="bottom">
                <p className="date">{proposal?.createdAt ? formatDate(new Date(proposal.createdAt)) : ""}</p>
                <p className="author">{truncateWalletAddress(proposal?.creator || "")}</p>
            </div>
        </div>
    )
}