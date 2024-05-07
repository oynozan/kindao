'use client'

import { useEffect } from 'react';
import { useTronStore } from '@/lib/states';
import * as TronDefault from '@/lib/tron/index.es.js';
import type * as TronType from '@/lib/tron/browser/index';

// @ts-expect-error everything is fine
const Tron = TronDefault as typeof TronType;

export default function InitializeTron() {

    const tronProvider = new Tron.Provider({ testnet: true });

    const setTron = useTronStore(state => state.setTron);

    useEffect(() => setTron(Tron, tronProvider), []);

    return <></>
}