'use client'

import './wallets.scss';
import Image from 'next/image';
import { KinDAO } from '@/lib/kindao';
import { useTronStore, useModalStore } from '@/lib/states';
import type { WalletAdapterInterface, WalletAdapterListType, WalletInterface } from '@multiplechain/types';

type AfterConnectEvent = (wallet: WalletInterface) => void;

export default function WalletHandler({ afterConnect } : { afterConnect?: AfterConnectEvent}) {

    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);
    const setLoading: (loading: boolean) => void = useModalStore(state => state.setLoading);

    const { utils, browser, types } = useTronStore(state => state.tron)
    const setWallet = useTronStore(state => state.setWallet);
    const setKinDao = useTronStore(state => state.setKinDao);
    const provider = useTronStore(state => state.provider);

    const connectWallet = async (adapter: WalletAdapterInterface): Promise<void> => {

        setLoading(true);

        const wallet = new browser.Wallet(adapter, provider);
        await wallet.connect(provider, { projectId: '113d9f5689edd84ff230c2a6d679c80c' });
        const kinDao = new KinDAO(provider, wallet);
        await kinDao.setContract();
        setKinDao(kinDao);
        setWallet(wallet);
        setModal('', {});

        setLoading(false);

        if (afterConnect) afterConnect(wallet);
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

        setTimeout(() => setLoading(false), 100);

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

    let adapters = browser.adapters

    const sortedKeys = Object.keys(adapters).sort(function(a, b) {
        const order = { true: 1, universal: 2, false: 3 };
        const valueA = adapters[a].platforms.includes('UNIVERSAL') ? 'universal' : adapters[a].isDetected();
        const valueB = adapters[b].platforms.includes('UNIVERSAL') ? 'universal' : adapters[b].isDetected();
        return order[valueA as keyof typeof order] - order[valueB as keyof typeof order];                     
    });

    // Set sorted adapters
    adapters = sortedKeys.reduce((sortedObj: WalletAdapterListType, key) => {
        sortedObj[key] = adapters[key];
        return sortedObj;
    }, {});

    return (
        <div className="wallet-list-wrapper">
            <div className="wallet-list-container">
                {Object.values(adapters).map((adapter, index) => (
                    adapterTemplate(adapter as WalletAdapterInterface)
                ))}
            </div>
        </div>
    )
}