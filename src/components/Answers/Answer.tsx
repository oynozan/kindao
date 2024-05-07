import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { formatDate, truncateWalletAddress } from "@/lib/helpers";
import { useModalStore, useTronStore } from '@/lib/states';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';

const WalletHandler = dynamic(() => import('@/components/Header/WalletHandler'), {
    ssr: false
});

export default async function AnswerSection({
    factId,
    proposalId,
    answer,
    author,
    votes,
    approved,
    date
} : {
    factId: string,
    proposalId: string,
    answer: string,
    author: string,
    votes: number,
    approved: boolean,
    date: Date,
}) {

    let isUp = true;
    const wallet = useTronStore(state => state.wallet);
    const kinDao = useTronStore(state => state.kinDao);
    const setLoading: (loading: boolean) => void = useModalStore(state => state.setLoading);
    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);
    const [requested, setRequested] = useState(false);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (wallet && clicked) {
            vote(isUp)
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

    const vote = async (_isUp: boolean) => {
        try {
            isUp = _isUp;

            setClicked(true);

            if (!wallet) {
                openWalletModal();
                return;
            }

            createCustomModal("Please confirm the vote request from your wallet.");

            if (requested) return;
            setRequested(true);
            const txHash = await kinDao.voteFact(proposalId, factId, isUp);

            createCustomModal("Fact is voted! Waiting for confirmation...");

            await kinDao.waitTransaction(txHash);

            window.location.reload();

            setModal("", {});
        } catch (error: any) {
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
        <div id={factId} className="answer-section">
            <div
                className={"votes " + (votes > 0 ? "positive" : (votes < 0 ? "negative" : "zero"))}
            >
                <div>
                    <div className="approval">{approved && (<FaCheck />)}</div>
                    <FaCaretUp onClick={() => vote(true)} />
                    <span>{votes}</span>
                    <FaCaretDown onClick={() => vote(false)} />
                </div>
            </div>
            <div className="content">
            <p className="answer" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer || "") }}></p>

                <div className="bottom">
                    <p className="date">{formatDate(date)}</p>
                    <Link
                        href={`/profile/${author}`}
                        className="author"
                    >
                        {truncateWalletAddress(author)}
                    </Link>
                </div>
            </div>
        </div>
    )
}