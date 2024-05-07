import { NftInterface } from '@multiplechain/types';
import { NftTransactionSigner } from '../services/TransactionSigner.ts';
import { Contract, InterfaceAbi } from './Contract.ts';
import { Provider } from '../services/Provider.ts';

export declare class NFT extends Contract implements NftInterface {
    /**
     * @param {string} address Contract address
     * @param {Provider} provider Blockchain network provider
     * @param {InterfaceAbi} ABI Contract ABI
     */
    constructor(address: string, provider?: Provider, ABI?: InterfaceAbi);
    /**
     * @returns {Promise<string>} NFT name
     */
    getName(): Promise<string>;
    /**
     * @returns {Promise<string>} NFT symbol
     */
    getSymbol(): Promise<string>;
    /**
     * @param {string} owner Wallet address
     * @returns {Promise<number>} Wallet balance as currency of NFT
     */
    getBalance(owner: string): Promise<number>;
    /**
     * @param {number | string} nftId NFT ID
     * @returns {Promise<string>} Wallet address of the owner of the NFT
     */
    getOwner(nftId: number | string): Promise<string>;
    /**
     * @param {number | string} nftId NFT ID
     * @returns {Promise<string>} URI of the NFT
     */
    getTokenURI(nftId: number | string): Promise<string>;
    /**
     * @param {number | string} nftId ID of the NFT that will be transferred
     * @returns {Promise<string | null>} Wallet address of the approved spender
     */
    getApproved(nftId: number | string): Promise<string | null>;
    /**
     * @param {string} sender Sender address
     * @param {string} receiver Receiver address
     * @param {number | string} nftId NFT ID
     * @returns {Promise<TransactionSigner>} Transaction signer
     */
    transfer(sender: string, receiver: string, nftId: number | string): Promise<NftTransactionSigner>;
    /**
     * @param {string} spender Spender address
     * @param {string} owner Owner address
     * @param {string} receiver Receiver address
     * @param {number | string} nftId NFT ID
     * @returns {Promise<TransactionSigner>} Transaction signer
     */
    transferFrom(spender: string, owner: string, receiver: string, nftId: number | string): Promise<NftTransactionSigner>;
    /**
     * Gives permission to the spender to spend owner's tokens
     * @param {string} owner Address of owner of the tokens that will be used
     * @param {string} spender Address of the spender that will use the tokens of owner
     * @param {number | string} nftId ID of the NFT that will be transferred
     * @returns {Promise<TransactionSigner>} Transaction signer
     */
    approve(owner: string, spender: string, nftId: number | string): Promise<NftTransactionSigner>;
}
