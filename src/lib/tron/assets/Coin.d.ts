import { CoinInterface } from '@multiplechain/types';
import { CoinTransactionSigner } from '../services/TransactionSigner.ts';
import { Provider } from '../services/Provider.ts';

export declare class Coin implements CoinInterface {
    /**
     * Blockchain network provider
     */
    provider: Provider;
    /**
     * @param {Provider} provider network provider
     */
    constructor(provider?: Provider);
    /**
     * @returns {string} Coin name
     */
    getName(): string;
    /**
     * @returns {string} Coin symbol
     */
    getSymbol(): string;
    /**
     * @returns {number} Decimal value of the coin
     */
    getDecimals(): number;
    /**
     * @param {string} owner Wallet address
     * @returns {Promise<number>} Wallet balance as currency of COIN
     */
    getBalance(owner: string): Promise<number>;
    /**
     * @param {string} sender Sender wallet address
     * @param {string} receiver Receiver wallet address
     * @param {number} amount Amount of assets that will be transferred
     * @returns {Promise<CoinTransactionSigner>} Transaction signer
     */
    transfer(sender: string, receiver: string, amount: number): Promise<CoinTransactionSigner>;
}
