'use client'

import dynamic from "next/dynamic";

import Button from "../Button";
import { useModalStore } from "@/lib/states";

const WalletHandler = dynamic(() => import('./WalletHandler'), {
    ssr: false
});

export default function WalletButton() {

    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);

    const openWalletModal = (): void => {
        setModal("custom", {
            content: (
                <WalletHandler />
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