'use client'

import Image from 'next/image';
import { useState } from "react";
import { useEffect } from 'react';
import dynamic from "next/dynamic";
import DOMPurify from "isomorphic-dompurify";

import { useContentStore, useModalStore, useTronStore } from '@/lib/states';
import Editor from '@/components/Editor';
import Button from "@/components/Button";

import './add.scss';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const WalletHandler = dynamic(() => import('@/components/Header/WalletHandler'), {
    ssr: false
});

let publishArgs = {}

export default function PublishProposal() {

    const router = useRouter();
    const wallet = useTronStore(state => state.wallet);
    const kinDao = useTronStore(state => state.kinDao);
    const content = useContentStore(state => state.content);
    const setContent = useContentStore(state => state.setContent);
    const setLoading: (loading: boolean) => void = useModalStore(state => state.setLoading);
    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);

    const [title, setTitle] = useState<string>("");
    const [bounty, setBounty] = useState<number>(100);

    useEffect(() => {
        if (wallet) {
            publish(...Object.values(publishArgs) as [string, string, number]);
        }
    }, [wallet])

    const openWalletModal = (): void => {
        setModal("custom", {
            content: (
                <WalletHandler />
            )
        })
    }

    const createCustomModal = async (text: string) => {
        setLoading(false);
        setModal("custom", {
            content: (
                <div style={{ textAlign: "center" }}>
                    <Image
                        src="/loader.svg"
                        alt="Loading"
                        width={100}
                        height={100}
                    />
                    <p>{text}</p>
                </div>
            )
        })
    }

    const publish = async (title: string, description: string, bounty: number) => {
        try {
            if (!title || !description || !bounty) {
                toast.error("Please fill all the fields");
                return;
            }
    
            if (bounty < 500) {
                toast.error("Minimum bounty is 500 KDAO");
                return;
            }
    
            publishArgs = { title, description, bounty };
    
            if (!wallet) {
                openWalletModal();
                return;
            }
    
            createCustomModal("Please confirm the proposal request from your wallet.");
    
            const txHash = await kinDao.createProposal(title, description, bounty);

            createCustomModal("Proposal is published successfully! Waiting for confirmation...");

            const proposalId = await kinDao.findProposalId(txHash);

            router.push("/proposal/" + proposalId);
        
            setModal("", {});
        } catch (error: any) {
            console.error(error);
            const message = String(error.message)
            if (!message.includes("Confirmation declined by user")) {
                toast.error("An error occured while publishing proposal");
            }
            setModal("", {});
        }
    }

    return (
        <div id="publish-request">

            <label htmlFor="title">Title</label>
            <input id="title" onChange={e => setTitle(e.target.value)} />

            <label>Describe your Question</label>
            <Editor set={setContent} />

            <div className="bottom">
                <div>
                    <label htmlFor="bounty">Bounty</label>
                    <input id="bounty" type="number" onChange={e => setBounty(parseFloat(e.target.value))} />
                </div>

                <Button
                    type="main"
                    click={() => publish(title, content, bounty)}
                >
                    Publish Proposal
                </Button>
            </div>

            <h5 className="preview-title">Preview: </h5>

            <h1>{title}</h1>
            <div
                className="preview"
                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}}
            ></div>
        </div>
    )
}