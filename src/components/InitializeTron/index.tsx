'use client'

import { useEffect } from 'react';
import { KinDAO } from '@/lib/kindao';
import { useTronStore } from '@/lib/states';
import * as TronDefault from '@beycandeveloper/tron';
import type * as TronType from '@/lib/tron/browser/index';

const Tron = TronDefault as typeof TronType;

export default function InitializeTron() {

    const tronProvider = new Tron.Provider({ testnet: true });

    const wallet = useTronStore(state => state.wallet);
    const setTron = useTronStore(state => state.setTron);
    const setKinDao = useTronStore(state => state.setKinDao);

    useEffect(() => {
        setTron(Tron, tronProvider);
    }, []);

    useEffect(() => {
        if (wallet) setKinDao(new KinDAO(tronProvider, wallet));
        else setKinDao(new KinDAO(tronProvider));
    }, [wallet])

    return <></>
}