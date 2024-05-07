import { TransactionSignerInterface } from '@multiplechain/types';
import { TokenTransaction } from '../models/TokenTransaction.ts';
import { CoinTransaction } from '../models/CoinTransaction.ts';
import { NftTransaction } from '../models/NftTransaction.ts';
import { Transaction } from '../models/Transaction.ts';
import { Provider } from '../services/Provider.ts';

interface ParameterInterface {
    value: {
        data: string;
        token_id: number;
        owner_address: string;
        call_token_value: number;
        contract_address: string;
    };
    type_url: string;
}
interface ContractDataInterface {
    parameter: ParameterInterface;
    type: string;
}
export interface TransactionData {
    visible: boolean;
    txID: string;
    raw_data: {
        contract: ContractDataInterface[];
        ref_block_bytes: string;
        ref_block_hash: string;
        expiration: number;
        fee_limit: number;
        timestamp: number;
    };
    raw_data_hex: string;
}
export interface SignedTransactionData extends TransactionData {
    signature: string[];
}
export declare class TransactionSigner implements TransactionSignerInterface {
    /**
     * Transaction data from the blockchain network
     */
    rawData: TransactionData;
    /**
     * Signed transaction data
     */
    signedData: SignedTransactionData;
    /**
     * Blockchain network provider
     */
    provider: Provider;
    /**
     * @param {TransactionData} rawData - Transaction data
     */
    constructor(rawData: TransactionData, provider?: Provider);
    /**
     * Sign the transaction
     * @param {string} privateKey - Transaction data
     * @returns {Promise<TransactionSigner>} Signed transaction data
     */
    sign(privateKey: string): Promise<TransactionSigner>;
    /**
     * Send the transaction to the blockchain network
     * @returns {Promise<Transaction>}
     */
    send(): Promise<Transaction>;
    /**
     * Get the raw transaction data
     * @returns Transaction data
     */
    getRawData(): TransactionData;
    /**
     * Get the signed transaction data
     * @returns Signed transaction data
     */
    getSignedData(): SignedTransactionData;
}
export declare class CoinTransactionSigner extends TransactionSigner {
    /**
     * Send the transaction to the blockchain network
     * @returns {Promise<CoinTransaction>} Transaction data
     */
    send(): Promise<CoinTransaction>;
}
export declare class TokenTransactionSigner extends TransactionSigner {
    /**
     * Send the transaction to the blockchain network
     * @returns {Promise<TokenTransaction>} Transaction data
     */
    send(): Promise<TokenTransaction>;
}
export declare class NftTransactionSigner extends TransactionSigner {
    /**
     * Send the transaction to the blockchain network
     * @returns {Promise<NftTransaction>} Transaction data
     */
    send(): Promise<NftTransaction>;
}
export {};
