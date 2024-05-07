'use client'

import { useAnswerStore, useModalStore, useTronStore } from "@/lib/states";
import Editor from "../Editor";
import Button from "../Button";
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const WalletHandler = dynamic(() => import('@/components/Header/WalletHandler'), {
    ssr: false
});

export default function Write({ id } : { id: string }) {

    const setAnswer = useAnswerStore(state => state.setContent);
    const content = useAnswerStore(state => state.content)
    
    const wallet = useTronStore(state => state.wallet);
    const kinDao = useTronStore(state => state.kinDao);
    const setLoading: (loading: boolean) => void = useModalStore(state => state.setLoading);
    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);
    const [clicked, setClicked] = useState(false);
    const [requested, setRequested] = useState(false);

    useEffect(() => {
        if (wallet && clicked) {
            send()
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

    const send = async () => {
        try {
            if (content == '<p></p>') {
                toast.error("Please enter a fact");
                return;
            }

            setClicked(true);
    
            if (!wallet) {
                openWalletModal();
                return;
            }
    
            createCustomModal("Please confirm the fact request from your wallet.");
    
            if (requested) return;

            setRequested(true);
            const txHash = await kinDao.createFact(id, content, '', '');
        
            createCustomModal("Fact is published successfully! Waiting for confirmation...");
    
            await kinDao.findFactId(txHash);
    
            window.location.reload();
    
            setModal("", {});
        } catch (error:any) {
            setRequested(false);
            console.error(error);
            const message = String(error.message)
            if (!message.includes("Confirmation declined by user")) {
                toast.error("An error occured while publishing proposal");
            }
            setModal("", {});
        }
    }

    return (
        <div className="enter-answer">
            <Editor set={setAnswer} />
            <Button type="main" click={() => send()}>Send Fact</Button>
        </div>
    )
}