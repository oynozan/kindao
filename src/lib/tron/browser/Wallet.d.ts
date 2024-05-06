import { Adapter } from '@tronweb3/tronwallet-abstract-adapter';
import { Provider } from '../services/Provider.ts';
import { WalletInterface, WalletAdapterInterface, WalletPlatformEnum, TransactionSignerInterface, ProviderInterface } from '@multiplechain/types';

export interface CustomAdapter extends Adapter {
    network?: () => Promise<any>;
}
export declare class Wallet implements WalletInterface {
    adapter: WalletAdapterInterface;
    walletProvider: CustomAdapter;
    networkProvider: Provider;
    /**
     * @param {WalletAdapterInterface} adapter
     */
    constructor(adapter: WalletAdapterInterface, provider?: Provider);
    /**
     * @returns {string}
     */
    getId(): string;
    /**
     * @returns {string}
     */
    getName(): string;
    /**
     * @returns {string}
     */
    getIcon(): string;
    /**
     * @returns {WalletPlatformEnum[]}
     */
    getPlatforms(): WalletPlatformEnum[];
    /**
     * @returns {string | undefined}
     */
    getDownloadLink(): string | undefined;
    /**
     * @param {string} url
     * @param {object} ops
     * @returns {string}
     */
    createDeepLink(url: string, ops?: object): string | null;
    /**
     * @param {ProviderInterface} provider
     * @param {Object} ops
     * @returns {Promise<string>}
     */
    connect(provider?: ProviderInterface, ops?: object): Promise<string>;
    /**
     * @returns {boolean}
     */
    isDetected(): Promise<boolean>;
    /**
     * @returns {boolean}
     */
    isConnected(): Promise<boolean>;
    /**
     * @returns {Promise<string>}
     */
    getChainId(): Promise<string>;
    /**
     * @returns {Promise<string>}
     */
    getAddress(): Promise<string>;
    /**
     * @param {string} message
     */
    signMessage(message: string): Promise<string>;
    /**
     * @param {TransactionSignerInterface} transactionSigner
     * @returns {Promise<string>}
     */
    sendTransaction(transactionSigner: TransactionSignerInterface): Promise<string>;
    /**
     * @param {string} eventName
     * @param {Function} callback
     * @returns {void}
     */
    on(eventName: string, callback: (...args: any[]) => void): void;
}
