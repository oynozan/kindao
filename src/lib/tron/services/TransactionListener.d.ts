import { Provider } from './Provider.ts';
import { TransactionTypeEnum, DynamicTransactionType, TransactionListenerInterface, TransactionListenerCallbackType, DynamicTransactionListenerFilterType } from '@multiplechain/types';

export declare class TransactionListener<T extends TransactionTypeEnum> implements TransactionListenerInterface<T> {
    /**
     * Transaction type
     */
    type: T;
    /**
     * Transaction listener callback
     */
    callbacks: TransactionListenerCallbackType[];
    /**
     * Transaction listener filter
     */
    filter?: DynamicTransactionListenerFilterType<T>;
    /**
     * Provider
     */
    provider: Provider;
    /**
     * Listener status
     */
    status: boolean;
    /**
     * Triggered transactions
     */
    triggeredTransactions: string[];
    /**
     * Dynamic stop method
     */
    dynamicStop: () => void;
    /**
     * @param {T} type - Transaction type
     * @param {DynamicTransactionListenerFilterType<T>} filter - Transaction listener filter
     * @param {Provider} provider - Provider
     */
    constructor(type: T, filter?: DynamicTransactionListenerFilterType<T>, provider?: Provider);
    /**
     * Close the listener
     * @returns {void}
     */
    stop(): void;
    /**
     * Start the listener
     * @returns {void}
     */
    start(): void;
    /**
     * Get the listener status
     * @returns {boolean} Listener status
     */
    getStatus(): boolean;
    /**
     * Listen to the transaction events
     * @param {TransactionListenerCallbackType} callback - Transaction listener callback
     * @returns {Promise<boolean>}
     */
    on(callback: TransactionListenerCallbackType): Promise<boolean>;
    /**
     * Trigger the event when a transaction is detected
     * @param {DynamicTransactionType<T>} transaction - Transaction data
     * @returns {void}
     */
    trigger<T extends TransactionTypeEnum>(transaction: DynamicTransactionType<T>): void;
    /**
     * General transaction process
     * @returns {void}
     */
    generalProcess(): void;
    /**
     * Contract transaction process
     * @returns {void}
     */
    contractProcess(): void;
    /**
     * Coin transaction process
     * @returns {void}
     */
    coinProcess(): void;
    /**
     * Token transaction process
     * @returns {void}
     */
    tokenProcess(): void;
    /**
     * NFT transaction process
     * @returns {void}
     */
    nftProcess(): void;
}
