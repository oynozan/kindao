'use client'

import { useEffect, useState } from "react";
import Image from "next/image";

import { useTronStore } from "@/lib/states";
import FactBox from "@/components/FactBox";
import { Proposal } from "@/lib/kindao";

export default function Proposals() {

    const kinDao = useTronStore(state => state.kinDao);
    const [proposals, setProposals] = useState<Proposal[]>([]);

    useEffect(() => {
        if (kinDao?.getProposals) {
            (async() => {
                const facts = await kinDao.getProposals();
                facts.forEach(fact => fact.createdAt *= 1000);
                setProposals(facts?.length ? facts : []);
            })()
        }
    }, [kinDao])

    return (
        <div className="facts">
            {!proposals?.length && (
                <div className="loader-wrapper">
                    <Image
                        src="/loader.svg"
                        alt="Loader"
                        height={150}
                        width={150}
                    />
                </div>
            )}
            {proposals.toReversed().map((propose, i) => {
                return (
                    <FactBox
                        key={i}
                        id={propose.id}
                        title={propose.title}
                        description={propose.description}
                        author={propose.creator}
                        bounty={propose.bounty}
                        date={new Date(propose.createdAt)}
                    />
                )
            })}
        </div>
    )
}