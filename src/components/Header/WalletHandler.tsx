'use client'

import './wallets.scss';
import Image from 'next/image';
import { useTronStore } from '@/lib/states';
import type { WalletAdapterInterface } from '@multiplechain/types';

export default function WalletHandler() {

    const { utils, browser, types } = useTronStore(state => state.tron)
    const setWallet = useTronStore(state => state.setWallet);
    const provider = useTronStore(state => state.provider);

    const connectWallet = async (adapter: WalletAdapterInterface): Promise<void> => {
        const wallet = new browser.Wallet(adapter, provider);
        await wallet.connect(provider, { projectId: 'kindao' });
        console.log(wallet);
        setWallet(wallet);
    }

    const adapterTemplate = (adapter: WalletAdapterInterface) => {
    
        const statuses = {
            universal:       <span key={1}></span>,
            detected:        <span key={2} className="detected">Detected</span>,
            download:        <span key={3} className="download">Download</span>,
            openInApp:       <span key={4} className="openInApp">Open In App</span>,
            onlyDesktop:     <span key={5} className="onlyDesktop">Only Desktop</span>,
            openInAppManual: <span key={6} className="openInAppManual">Open In App Manual</span>
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
            <div
                data-key={adapter.id}
                className="wallet-adapter"
                onClick={() => connectWallet(adapter)}
            >
                <Image
                    src={adapter.icon}
                    alt={adapter.id}
                    width={50}
                    height={50}
                    className="icon"
                />
                <span className="name">{adapter.name}</span>
                <span className="status">{getStatus()}</span>
            </div>
        )
    }

    return (
        <div className="wallet-list-wrapper">
            <div className="wallet-list-container">
                {Object.values(browser.adapters).map((adapter, index) => (
                    adapterTemplate(adapter as WalletAdapterInterface)
                ))}
            </div>
        </div>
    )
}