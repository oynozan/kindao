'use client'

import { useEffect } from 'react';

import * as TronDefault from '@/lib/tron/index.es.js'
import type * as TronType from '@/lib/tron/browser/index'
import type { WalletAdapterInterface } from '@multiplechain/types'

// @ts-expect-error everything is fine
const { Provider, browser } = TronDefault as typeof TronType

declare global {
    interface Window {
        connectAdapter: (adapter: WalletAdapterInterface) => Promise<string>;
    }
}

export default function WalletHandler() {

    useEffect(() => {
        console.log(browser);
    }, []);

    return (
        <>
        </>
    )
}