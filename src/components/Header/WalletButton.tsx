'use client'

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { WalletInterface } from "@multiplechain/types";

import Button from "../Button";
import ProfilePicture from "../ProfilePicture";
import DropdownButton from "../Dropdown/DropdownButton";

import { truncateWalletAddress } from "@/lib/helpers";
import { useModalStore, useProfileStore, useTronStore } from "@/lib/states";

const WalletHandler = dynamic(() => import('./WalletHandler'), {
    ssr: false
});

const CreateProfile = dynamic(() => import('./CreateProfile'), {
    ssr: false
});

export default function WalletButton() {

    const setLoading: (loading: boolean) => void = useModalStore(state => state.setLoading);
    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);
    const setWallet: (wallet: WalletInterface | null) => void = useTronStore(state => state.setWallet);
    const setProfile: (i: { username: string, avatarUrl: string | null } | null) => void = useProfileStore(state => state.setProfile);

    const wallet = useTronStore(state => state.wallet);
    const profile = useProfileStore(state => state.profile);

    const [address, setAddress] = useState<string | null>(null);

    const openWalletModal = (): void => {
        setModal("custom", {
            content: (
                <WalletHandler />
            )
        })
    }

    const createProfile = (): void => {
        setLoading(false);
        setModal("custom", {
            content: (
                <CreateProfile set={setProfile} />
            )
        })
    }

    const disconnect = (): void => {
        if (wallet?.adapter?.disconnect) wallet.adapter.disconnect();
        setWallet(null);
        setProfile(null);
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
                    <>
                    { profile ? (
                        <Button key={1} type="blank" href={`/profile/${address}`}>Profile</Button>
                    ) : (
                        <Button key={2} type="blank" click={createProfile}>Create Profile</Button>
                    )}
                    </>,
                    <Button key={3} type="blank" click={disconnect}>Disconnect</Button>
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