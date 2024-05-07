'use client'

import './wallets.scss';
import Image from 'next/image'
import * as TronDefault from '@/lib/tron/index.es.js'
import type * as TronType from '@/lib/tron/browser/index'
import type { WalletAdapterInterface } from '@multiplechain/types'

// @ts-expect-error everything is fine
const { Provider, browser, utils, types } = TronDefault as typeof TronType

const provider = new Provider({
    testnet: true,
})

const connectWallet = async (adapter: WalletAdapterInterface): Promise<void> => {
    const wallet = new browser.Wallet(adapter, provider)
    await wallet.connect(provider, {
        projectId: '113d9f5689edd84ff230c2a6d679c80c'
    })
}

export default function WalletHandler() {

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