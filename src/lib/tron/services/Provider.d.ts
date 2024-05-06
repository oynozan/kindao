import { TronWeb } from './TronWeb.ts';
import { NetworkConfigInterface, ProviderInterface } from '@multiplechain/types';

export interface TronNodeInfoInterface {
    id: string;
    node: string;
    name: string;
    host: string;
    event: string;
    explorer: string;
}
export type TronNodeInfoListInterface = Record<string, TronNodeInfoInterface>;
export declare class Provider implements ProviderInterface {
    /**
     * Network configuration of the provider
     */
    network: NetworkConfigInterface;
    /**
     * Node list
     */
    nodes: TronNodeInfoListInterface;
    /**
     * Node information
     */
    node: TronNodeInfoInterface;
    /**
     * TronWeb instance
     */
    tronWeb: TronWeb;
    /**
     * Static instance of the provider
     */
    private static _instance;
    /**
     * @param network - Network configuration of the provider
     */
    constructor(network: NetworkConfigInterface);
    /**
     * Get the static instance of the provider
     * @returns {Provider} Provider
     */
    static get instance(): Provider;
    /**
     * Initialize the static instance of the provider
     * @param {NetworkConfigInterface} network - Network configuration of the provider
     * @returns {void}
     */
    static initialize(network: NetworkConfigInterface): void;
    /**
     * Check RPC connection
     * @param {string} _url - RPC URL
     * @returns {Promise<boolean | Error>}
     */
    checkRpcConnection(_url?: string): Promise<boolean | Error>;
    /**
     * Check WS connection
     * @param {string} _url - Websocket URL
     * @returns {Promise<boolean | Error>}
     */
    checkWsConnection(_url?: string): Promise<boolean | Error>;
    /**
     * Update network configuration of the provider
     * @param network - Network configuration of the provider
     */
    update(network: NetworkConfigInterface): void;
    /**
     * Get the current network configuration is testnet or not
     * @returns boolean
     */
    isTestnet(): boolean;
}
