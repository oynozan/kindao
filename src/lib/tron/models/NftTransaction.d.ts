import { TransactionStatusEnum, NftTransactionInterface, AssetDirectionEnum } from '@multiplechain/types';
import { ContractTransaction } from './ContractTransaction.ts';

export declare class NftTransaction extends ContractTransaction implements NftTransactionInterface {
    /**
     * @returns {Promise<string>} Receiver wallet address
     */
    getReceiver(): Promise<string>;
    /**
     * @returns {Promise<string>} Wallet address of the sender of transaction
     */
    getSender(): Promise<string>;
    /**
     * @returns {Promise<number>} NFT ID
     */
    getNftId(): Promise<number>;
    /**
     * @param {AssetDirectionEnum} direction - Direction of the transaction (nft)
     * @param {string} address - Wallet address of the receiver or sender of the transaction, dependant on direction
     * @param {number} nftId ID of the NFT that will be transferred
     * @override verifyTransfer() in AssetTransactionInterface
     * @returns {Promise<TransactionStatusEnum>} Status of the transaction
     */
    verifyTransfer(direction: AssetDirectionEnum, address: string, nftId: number | string): Promise<TransactionStatusEnum>;
}
