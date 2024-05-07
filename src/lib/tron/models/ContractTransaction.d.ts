import { ContractTransactionInterface } from '@multiplechain/types';
import { Transaction, TransactionData } from './Transaction.ts';

export interface DecodedInputData {
    methodName: string;
    inputNames: string[];
    inputTypes: string[];
    decodedInput: {
        [key: string]: any;
        _length: number;
    };
}
export declare class ContractTransaction extends Transaction implements ContractTransactionInterface {
    /**
     * @returns {Promise<string>} Contract address of the transaction
     */
    getAddress(): Promise<string>;
    /**
     * @param {TransactionData} txData Transaction data
     * @returns {Promise<DecodedInputData | null>} Decoded transaction data
     */
    decodeData(txData?: TransactionData): Promise<DecodedInputData | null>;
}
