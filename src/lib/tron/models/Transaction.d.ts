import { TransactionInterface, TransactionStatusEnum } from '@multiplechain/types';
import { Provider } from '../services/Provider.ts';

interface RetObject {
    contractRet: string;
}
interface ContractObject {
    parameter: {
        value: {
            data?: string;
            owner_address: string;
            contract_address?: string;
            to_address?: string;
            amount?: number;
        };
        type_url: string;
    };
    type: string;
}
interface LogObject {
    address: string;
    topics: string[];
    data: string;
}
export interface TransactionData {
    ret: RetObject[];
    signature: string[];
    txID: string;
    raw_data: {
        contract: ContractObject[];
        ref_block_bytes: string;
        ref_block_hash: string;
        expiration: number;
        timestamp: number;
        fee_limit?: number;
    };
    raw_data_hex: string;
    info?: {
        id: string;
        fee: number;
        packingFee: number;
        blockNumber: number;
        blockTimeStamp: number;
        contractResult: string[];
        contract_address?: string;
        receipt: {
            result?: string;
            net_fee: number;
            net_usage?: number;
            energy_fee?: number;
            energy_usage?: number;
            energy_usage_total?: number;
            energy_penalty_total?: number;
        };
        result?: string;
        resMessage?: string;
        log?: LogObject[];
    };
}
export declare class Transaction implements TransactionInterface {
    /**
     * Each transaction has its own unique ID defined by the user
     */
    id: string;
    /**
     * Blockchain network provider
     */
    provider: Provider;
    /**
     * Transaction data after completed
     */
    data: TransactionData;
    /**
     * @param {string} id Transaction id
     * @param {Provider} provider Blockchain network provider
     */
    constructor(id: string, provider?: Provider);
    /**
     * @returns {Promise<TransactionData | null>} Transaction data
     */
    getData(): Promise<TransactionData | null>;
    /**
     * @param {number} ms - Milliseconds to wait for the transaction to be confirmed. Default is 4000ms
     * @returns {Promise<TransactionStatusEnum>} Status of the transaction
     */
    wait(ms?: number): Promise<TransactionStatusEnum>;
    /**
     * @returns {string} Transaction ID
     */
    getId(): string;
    /**
     * @returns {string} Transaction URL
     */
    getUrl(): string;
    /**
     * @returns {Promise<string>} Wallet address of the sender of transaction
     */
    getSigner(): Promise<string>;
    /**
     * @returns {Promise<number>} Transaction fee
     */
    getFee(): Promise<number>;
    /**
     * @returns {Promise<number>} Block number that transaction
     */
    getBlockNumber(): Promise<number>;
    /**
     * @returns {Promise<number>} Block timestamp that transaction
     */
    getBlockTimestamp(): Promise<number>;
    /**
     * @returns {Promise<number>} Confirmation count of the block
     */
    getBlockConfirmationCount(): Promise<number>;
    /**
     * @returns {Promise<TransactionStatusEnum>} Status of the transaction
     */
    getStatus(): Promise<TransactionStatusEnum>;
}
export {};
