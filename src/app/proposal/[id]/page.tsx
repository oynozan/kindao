"use client"

import { notFound } from "next/navigation";
import { FaAward } from "react-icons/fa";

import { formatDate, truncateWalletAddress } from "@/lib/helpers";
import AnswerSection from "@/components/Answers/Answer";
import Write from "@/components/Answers/Write";

import './post.scss';
import { useTronStore } from '@/lib/states';
import { useEffect, useState } from 'react';
import { Fact, Proposal } from '@/lib/kindao';

export default function ProposalPage({
    params
} : {
    params: { id: string }
}) {

    const proposalId = params.id;

    const kinDao = useTronStore(state => state.kinDao);
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [facts, setFacts] = useState<Fact[]>([]);

    useEffect(() => {
        console.log(proposalId);
        (async() => {
            const proposal = await kinDao.getProposal(proposalId);
            console.log(proposal)
            if (proposal)  {
                setProposal(proposal);
                setFacts(await kinDao.getFacts(proposalId));
            }
        })()
    }, [])

    if (!proposal) return notFound();

    return (
        <div id="post-container">
            <div id="post">
                <div className="info">
                    <h1>{proposal.title}</h1>
                    <div className="bounty">{proposal.bounty.toFixed(2)}<FaAward /></div>
                </div>

                <p>{proposal.description}</p>

                <div className="bottom">
                    <p className="date">{formatDate(new Date(proposal.createdAt))}</p>
                    <p className="author">{truncateWalletAddress(proposal.creator)}</p>
                </div>
            </div>

            {/* Answers */}
            <div id="answers">
                <div className="list">
                    { !facts?.length && (<p>No answers yet, be the first one!</p>) }
                    { facts.map((fact, i) => {
                        return (
                            <AnswerSection
                                key={i}
                                id={fact.id}
                                answer={fact.description}
                                author={fact.creator}
                                votes={5} // TODO: check it
                                approved={fact.approved}
                                date={new Date(fact.createdAt)}
                            />
                        )
                    }) }
                </div>
            </div>

            <div className="write-answer">
                <Write id={proposalId} />
            </div>
        </div>
    )
}