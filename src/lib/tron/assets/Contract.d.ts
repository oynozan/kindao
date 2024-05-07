import { TronWeb } from '../services/TronWeb.ts';
import { ContractInterface } from '@multiplechain/types';
import { Provider } from '../services/Provider.ts';

interface InputOutputInterface {
    internalType: string;
    name: string;
    type: string;
}
interface FunctionInterface {
    type: string;
    name?: string;
    indexed?: boolean;
    payable?: boolean;
    constant?: boolean;
    anonymous?: boolean;
    stateMutability?: string;
    inputs: InputOutputInterface[];
    outputs?: InputOutputInterface[];
}
export type InterfaceAbi = FunctionInterface[];
type TronContract = Record<string, (...args: any[]) => {
    call: () => any;
}>;
export interface TransactionDataOptions {
    feeLimit?: number;
    callValue?: number;
    tokenValue?: number;
    tokenId?: number;
}
export type TransactionDataParameters = ReadonlyArray<{
    type: string;
    value: string | number;
}>;
export interface TransactionRawData {
    address: string;
    method: string;
    options: TransactionDataOptions;
    parameters: TransactionDataParameters;
    from: string;
}
export declare class Contract implements ContractInterface {
    /**
     * Contract address
     */
    address: string;
    /**
     * Blockchain network provider
     */
    provider: Provider;
    /**
     * Contract ABI
     */
    ABI: InterfaceAbi;
    /**
     * TronWeb service
     */
    tronWeb: TronWeb;
    /**
     * Tron contract
     */
    tronContract: TronContract;
    /**
     * @param {string} address Contract address
     * @param {Provider} provider Blockchain network provider
     * @param {InterfaceAbi} ABI Contract ABI
     */
    constructor(address: string, provider?: Provider, ABI?: InterfaceAbi);
    /**
     * @returns {Promise<void>} Set Tron contract
     */
    setTronContract(): Promise<void>;
    /**
     * @returns {string} Contract address
     */
    getAddress(): string;
    /**
     * @param {string} method Method name
     * @param {any[]} args Method parameters
     * @returns {Promise<any>} Method result
     */
    callMethod(method: string, ...args: any[]): Promise<any>;
    /**
     * @param {string} _method Method name
     * @param {any[]} _args Sender wallet address
     * @returns {Promise<string>} Encoded method data
     */
    getMethodData(_method: string, ..._args: any[]): Promise<any>;
    /**
     * @param {string} method Method name
     * @returns {string} Method output
     */
    generateFunction(method: string): string;
    generateParameters(method: string, ...args: any[]): any;
    /**
     * @param {string} method Method name
     * @param {string} from Sender wallet address
     * @param {any[]} args Method parameters
     * @returns {Promise<TransactionRawData>} Encoded method data
     */
    createTransactionData(method: string, from: string, ...args: any[]): Promise<TransactionRawData>;
}
export {};
