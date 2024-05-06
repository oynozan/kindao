'use client'

import * as TronDefault from '@/lib/tron/index.es.js'
import type * as TronType from '@/lib/tron/browser/index'
import type { WalletAdapterInterface } from '@multiplechain/types'

// @ts-expect-error everything is fine
const { Provider, browser } = TronDefault as typeof TronType

import Button from "../Button";
import { useModalStore } from "@/lib/states";
import { useEffect } from 'react';

declare global {
    interface Window {
        connectAdapter: (adapter: WalletAdapterInterface) => Promise<string>;
    }
}

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

    useEffect(() => {
        // Tron window variable declaration for browser
        const provider = new Provider({
            testnet: true
        });

        window.connectAdapter = async (adapter: WalletAdapterInterface): Promise<string> => {
            const wallet = new browser.Wallet(adapter, provider)
            return await wallet.connect(provider, {
                projectId: '113d9f5689edd84ff230c2a6d679c80c'
            })
        };

    }, []);

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