'use client'

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import Button from "../Button";
import { useModalStore, useWalletsStore } from "@/lib/states";

const WalletHandler = dynamic(() => import('./WalletHandler'), {
    ssr: false
});

export default function WalletButton() {

    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);
    const wallets: Array<ReactNode> = useWalletsStore(state => state.wallets);

    const openWalletModal = (): void => {
        setModal("custom", {
            content: (
<<<<<<< HEAD
                <WalletHandler />
=======
                <div>
                    {wallets.map((wallet, i) => {
                        return (
                            <div key={i} className="wallet-wrapper">
                                {wallet}
                            </div>
                        )
                    })}
                </div>
>>>>>>> f7c6db5 (adapter list)
            )
        })
    }

    return (
        <>
            <Button
                href="/"
                type="main"
                click={openWalletModal}
            >
                Connect your Wallet
            </Button>
        </>
    )
}