'use client'

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import Button from "../Button";
import { truncateWalletAddress } from "@/lib/helpers";
import { useModalStore, useTronStore } from "@/lib/states";

const WalletHandler = dynamic(() => import('./WalletHandler'), {
    ssr: false
});

export default function WalletButton() {

    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);
    const wallet = useTronStore(state => state.wallet);

    const [address, setAddress] = useState<string | null>(null);

    const openWalletModal = (): void => {
        setModal("custom", {
            content: (
                <WalletHandler />
            )
        })
    }

    useEffect(() => {
        (async() => {
            setAddress(await wallet?.getAddress() ?? null);
        })()
    }, [wallet]);

    return (
        <>
        {address ? (
            <p className="address">{truncateWalletAddress(address)}</p>
        ) : (
            <Button
                href="/"
                type="main"
                click={openWalletModal}
                >
                Connect your Wallet
            </Button>
        )}
        </>
    )
}