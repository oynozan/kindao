'use client'

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { WalletInterface } from "@multiplechain/types";

import Button from "../Button";
import ProfilePicture from "../ProfilePicture";
import DropdownButton from "../Dropdown/DropdownButton";

import { truncateWalletAddress } from "@/lib/helpers";
import { useModalStore, useTronStore } from "@/lib/states";

const WalletHandler = dynamic(() => import('./WalletHandler'), {
    ssr: false
});

export default function WalletButton() {

    const setLoading: (loading: boolean) => void = useModalStore(state => state.setLoading);
    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);
    const setWallet: (wallet: WalletInterface | null) => void = useTronStore(state => state.setWallet);

    const wallet = useTronStore(state => state.wallet);

    const [address, setAddress] = useState<string | null>(null);

    const openWalletModal = (): void => {
        setModal("custom", {
            content: (
                <WalletHandler />
            )
        })
    }

    const disconnect = (): void => {
        if (wallet?.adapter?.disconnect) wallet.adapter.disconnect();
        setWallet(null);
    }

    useEffect(() => {
        (async() => {
            setAddress(await wallet?.getAddress() ?? null);
        })()
        setLoading(true);
    }, [wallet]);

    return (
        <>
        {address ? (
            <DropdownButton
                type="blank"
                items={[
                    <Button key={1} type="blank" href={`/profile/${address}`}>Profile</Button>,
                    <Button key={2} type="blank" click={disconnect}>Disconnect</Button>
                ]}
            >
                <div className="header-profile">
                    <p className="address">{truncateWalletAddress(address)}</p>
                    <ProfilePicture address={address} />
                </div>
            </DropdownButton>
        ) : (
            <Button
                type="main"
                click={openWalletModal}
            >
                Connect your Wallet
            </Button>
        )}
        </>
    )
}