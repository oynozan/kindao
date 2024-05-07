'use client'

import { useAnswerStore, useModalStore, useTronStore } from "@/lib/states";
import Editor from "../Editor";
import Button from "../Button";
import toast from 'react-hot-toast';
import { useEffect } from 'react';
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

    useEffect(() => {
        if (wallet) {
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
        if (!content) {
            toast.error("Please enter a fact");
        }

        if (!wallet) {
            openWalletModal();
            return;
        }

        createCustomModal("Please confirm the fact request from your wallet.");

        const txHash = await kinDao.createFact(id, content, '', '');
    
        createCustomModal("Fact is published successfully! Waiting for confirmation...");

        await kinDao.findFactId(txHash);

        window.location.reload();

        setModal("", {});
    }

    return (
        <div className="enter-answer">
            <Editor set={setAnswer} />
            <Button type="main" click={() => send()}>Send Fact</Button>
        </div>
    )
}