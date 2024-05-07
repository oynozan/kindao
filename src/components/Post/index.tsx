'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaAward } from 'react-icons/fa';
import Image from 'next/image';

import { Proposal } from '@/lib/kindao';
import { useTronStore } from '@/lib/states';
import { formatDate, truncateWalletAddress } from '@/lib/helpers';

export default function PostComponent({ id } : { id: string }) {

    const router = useRouter()

    const kinDao = useTronStore(state => state.kinDao);
    const [proposal, setProposal] = useState<Proposal | null>(null);

    useEffect(() => {
        // @ts-expect-error
        if (kinDao?.getProposals) {
            (async() => {
                const proposal = await kinDao.getProposal(id);
                if (proposal) setProposal(proposal);
                else router.push("/404");
            })()
        }
    }, [kinDao])

    return (
        <div id="post">
            {!proposal && (
                <Image
                    src="/loader.svg"
                    alt="Loading"
                    width={50}
                    height={50}
                />
            )}

            <div className="info">
                <h1>{proposal?.title || ""}</h1>
                <div className="bounty">{(proposal?.bounty || 0).toFixed(2)} KDAO <FaAward /></div>
            </div>

            <p dangerouslySetInnerHTML={{ __html: proposal?.description || "" }}></p>

            <div className="bottom">
                <p className="date">{proposal?.createdAt ? formatDate(new Date(proposal.createdAt)) : ""}</p>
                <p className="author">{truncateWalletAddress(proposal?.creator || "")}</p>
            </div>
        </div>
    )
}