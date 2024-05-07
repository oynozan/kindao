import { TransactionStatusEnum, AssetDirectionEnum, CoinTransactionInterface } from '@multiplechain/types';
import { Transaction } from './Transaction.ts';

export declare class CoinTransaction extends Transaction implements CoinTransactionInterface {
    /**
     * @returns {Promise<string>} Wallet address of the receiver of transaction
     */
    getReceiver(): Promise<string>;
    /**
     * @returns {Promise<string>} Wallet address of the sender of transaction
     */
    getSender(): Promise<string>;
    /**
     * @returns {Promise<number>} Amount of coin that will be transferred
     */
    getAmount(): Promise<number>;
    /**
     * @param {AssetDirectionEnum} direction - Direction of the transaction (asset)
     * @param {string} address - Wallet address of the receiver or sender of the transaction, dependant on direction
     * @param {number} amount Amount of assets that will be transferred
     * @returns {Promise<TransactionStatusEnum>} Status of the transaction
     */
    verifyTransfer(direction: AssetDirectionEnum, address: string, amount: number): Promise<TransactionStatusEnum>;
}
