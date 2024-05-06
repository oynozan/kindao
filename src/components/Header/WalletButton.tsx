'use client'

import { browser, Provider } from '@multiplechain/tron';

import Button from "../Button";
import { useModalStore } from "@/lib/states";
import { useEffect } from 'react';

export default function WalletButton() {

    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);

    const openWalletModal = (): void => {
        setModal("custom", {
            content: (
                <div>
                    HELLO
                </div>
            )
        })
    }

    /*useEffect(() => {
        // Tron window variable declaration for browser
        (window as any).Tron = browser;

        const provider = new Provider({
            testnet: true
        });

        (window as any).adapters = {};
        (window as any).connectAdapter = async (adapter: any) => {
            if (adapter.disconnect) {
                await adapter.disconnect()
            }

            const wallet = new browser.Wallet(adapter)
            const adapterProvider = await wallet.connect(provider, {
                projectId: ''
            })
        };

        let adapters = browser.adapters;

        console.log(adapters);
    }, []);*/

    return (
        <Button
            href="/"
            type="main"
            click={openWalletModal}
        >
            Connect your Wallet
        </Button>
    )
}