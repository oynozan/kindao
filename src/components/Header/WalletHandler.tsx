'use client'

<<<<<<< HEAD
import './wallets.scss';
import Image from 'next/image'
import { useTronStore } from '@/lib/states'
import type { WalletAdapterInterface } from '@multiplechain/types'

export default function WalletHandler() {

    const provider = useTronStore(state => state.provider)
    const setWallet = useTronStore(state => state.setWallet)
    const { utils, browser, types } = useTronStore(state => state.tron)

    const connectWallet = async (adapter: WalletAdapterInterface): Promise<void> => {
        const wallet = new browser.Wallet(adapter, provider)
        await wallet.connect(provider, {
            projectId: '113d9f5689edd84ff230c2a6d679c80c'
        })
        setWallet(wallet)
    }

    const adapterTemplate = (adapter: WalletAdapterInterface) => {
    
        const statuses = {
            universal: `<span></span>`,
            detected: `<span class="detected">Detected</span>`,
            download: `<span class="download">Download</span>`,
            onlyDesktop: `<span class="onlyDesktop">Only Desktop</span>`,
            openInApp: `<span class="openInApp">Open In App</span>`,
            openInAppManual: `<span class="openInAppManual">Open In App Manual</span>`
        }

        const getStatus = () => {
            if (adapter.platforms.includes(types.WalletPlatformEnum.UNIVERSAL)) {
                return statuses.universal;
            } if (adapter.isDetected() === true) {
                return statuses.detected;
            } else if (!utils.isMobile() && adapter.isDetected() === false) {
                return statuses.download;
            } else if (utils.isMobile() && !adapter.platforms.includes(types.WalletPlatformEnum.MOBILE)) {
                return statuses.onlyDesktop;
            } else if (utils.isMobile() && adapter.createDeepLink) {
                return statuses.openInApp;
            } else if (utils.isMobile() && !adapter.createDeepLink) {
                return statuses.openInAppManual;
            }
        }

        return (
            <li data-key={adapter.id} onClick={void connectWallet(adapter)}>
                    <Image
                        src={adapter.icon}
                        alt={adapter.id}
                        width={50}
                        height={50}
                        className="icon"
                    />
                <span className="name">{adapter.name}</span>
                <span className="status">
                    {getStatus()}
                </span>
            </li>
        )
    }
=======
import Image from 'next/image';
import { useWalletsStore } from '@/lib/states';
import { type ReactNode, useEffect } from 'react';
import { isMobile } from '@multiplechain/utils';
import { WalletPlatformEnum, type WalletAdapterInterface } from '@multiplechain/types';

import type * as TronType from '@/lib/tron/browser/index'
import * as TronDefault from '@/lib/tron/index.es.js'

// @ts-expect-error everything is fine
const { Provider, browser } = TronDefault as typeof TronType

declare global {
    interface Window {
        connectAdapter: (adapter: WalletAdapterInterface) => Promise<string>;
        adapters: {
            [id: string]: WalletAdapterInterface
        }
    }
}

export default function WalletHandler() {

    const setWallets = useWalletsStore(state => state.setWallets);

    useEffect(() => {
        // Tron window variable declaration for browser
        const provider = new Provider({
            testnet: false
        });

        let adapters = browser.adapters;

        const connectAdapter = async (adapter: WalletAdapterInterface): Promise<string> => {
            const wallet = new browser.Wallet(adapter, provider);

            return await wallet.connect(provider, {
                projectId: 'kindao'
            });
        };

        const adapterTemplate = (adapter: WalletAdapterInterface) => {
            window.adapters[adapter.id] = adapter;

            const statuses = {
                universal:       <span></span>,
                detected:        <span className="detected">Detected</span>,
                download:        <span className="download">Download</span>,
                onlyDesktop:     <span className="onlyDesktop">Only Desktop</span>,
                openInApp:       <span className="openInApp">Open In App</span>,
                openInAppManual: <span className="openInAppManual">Open In App Manual</span>
            }

            const getStatus = (): ReactNode => {
                if (adapter.platforms.includes(WalletPlatformEnum.UNIVERSAL))
                    return statuses.universal;
                if (adapter.isDetected() === true)
                    return statuses.detected;
                else if (!isMobile() && adapter.isDetected() === false)
                    return statuses.download;
                else if (isMobile() && !adapter.platforms.includes(WalletPlatformEnum.MOBILE))
                    return statuses.onlyDesktop;
                else if (isMobile() && adapter.createDeepLink)
                    return statuses.openInApp;
                else if (isMobile() && !adapter.createDeepLink)
                    return statuses.openInAppManual;
                return <span></span>
            }

            return (
                <div
                    data-key={adapter.id}
                    onClick={() => connectAdapter(adapters[adapter.id])}
                >
                    <Image
                        className="icon"
                        src={adapter.icon}
                        alt={adapter.id}
                        height={50}
                        width={50}
                    />
                    <span className="name">{adapter.name}</span>
                    <span className="status">{getStatus() || ""}</span>
                </div>
            )
        }

        let adapter_els: Array<ReactNode> = [];

        Object.values(adapters).forEach(adapter => {
            adapter_els.push(adapterTemplate(adapter));
        });

        setWallets(adapter_els);
    }, []);
>>>>>>> f7c6db5 (adapter list)

    return (
        <div className="wallet-list-wrapper">
            <ul className="wallet-list-container">
                {Object.values(browser.adapters).map((adapter, index) => (
                    adapterTemplate(adapter)
                ))}
            </ul>
        </div>
    )
}