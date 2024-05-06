import { Provider } from '../services/Provider.ts';
import { TokenInterface } from '@multiplechain/types';
import { TokenTransactionSigner } from '../services/TransactionSigner.ts';
import { Contract, InterfaceAbi } from './Contract.ts';

export declare class Token extends Contract implements TokenInterface {
    /**
     * @param {string} address Contract address
     * @param {Provider} provider Blockchain network provider
     * @param {InterfaceAbi} ABI Contract ABI
     */
    constructor(address: string, provider?: Provider, ABI?: InterfaceAbi);
    /**
     * @returns {Promise<string>} Token name
     */
    getName(): Promise<string>;
    /**
     * @returns {Promise<string>} Token symbol
     */
    getSymbol(): Promise<string>;
    /**
     * @returns {Promise<number>} Decimal value of the token
     */
    getDecimals(): Promise<number>;
    /**
     * @param {string} owner Wallet address
     * @returns {Promise<number>} Wallet balance as currency of TOKEN
     */
    getBalance(owner: string): Promise<number>;
    /**
     * @returns {Promise<number>} Total supply of the token
     */
    getTotalSupply(): Promise<number>;
    /**
     * @param {string} owner Address of owner of the tokens that is being used
     * @param {string} spender Address of the spender that is using the tokens of owner
     * @returns {Promise<number>} Amount of tokens that the spender is allowed to spend
     */
    getAllowance(owner: string, spender: string): Promise<number>;
    /**
     * transfer() method is the main method for processing transfers for fungible assets (TOKEN, COIN)
     * @param {string} sender Sender wallet address
     * @param {string} receiver Receiver wallet address
     * @param {number} amount Amount of assets that will be transferred
     * @returns {Promise<TransactionSigner>} Transaction signer
     */
    transfer(sender: string, receiver: string, amount: number): Promise<TokenTransactionSigner>;
    /**
     * @param {string} spender Address of the spender of transaction
     * @param {string} owner Sender wallet address
     * @param {string} receiver Receiver wallet address
     * @param {number} amount Amount of tokens that will be transferred
     * @returns {Promise<TransactionSigner>} Transaction signer
     */
    transferFrom(spender: string, owner: string, receiver: string, amount: number): Promise<TokenTransactionSigner>;
    /**
     * Gives permission to the spender to spend owner's tokens
     * @param {string} owner Address of owner of the tokens that will be used
     * @param {string} spender Address of the spender that will use the tokens of owner
     * @param {number} amount Amount of the tokens that will be used
     * @returns {Promise<TransactionSigner>} Transaction signer
     */
    approve(owner: string, spender: string, amount: number): Promise<TokenTransactionSigner>;
}
