import { TransactionStatusEnum, AssetDirectionEnum, TokenTransactionInterface } from '@multiplechain/types';
import { ContractTransaction } from './ContractTransaction.ts';

export declare class TokenTransaction extends ContractTransaction implements TokenTransactionInterface {
    /**
     * @returns {Promise<string>} Wallet address of the receiver of transaction
     */
    getReceiver(): Promise<string>;
    /**
     * @returns {Promise<string>} Wallet address of the sender of transaction
     */
    getSender(): Promise<string>;
    /**
     * @returns {Promise<number>} Amount of tokens that will be transferred
     */
    getAmount(): Promise<number>;
    /**
     * @param {AssetDirectionEnum} direction - Direction of the transaction (token)
     * @param {string} address - Wallet address of the owner or spender of the transaction, dependant on direction
     * @param {number} amount Amount of tokens that will be approved
     * @returns {Promise<TransactionStatusEnum>} Status of the transaction
     */
    verifyTransfer(direction: AssetDirectionEnum, address: string, amount: number): Promise<TransactionStatusEnum>;
}
