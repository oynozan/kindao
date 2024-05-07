import { WalletAdapterListType, RegisterWalletAdapterType } from '@multiplechain/types';
import { Wallet } from './Wallet.ts';

import * as adapterList from './adapters/index.ts';
export * from '../index.ts';
export declare const browser: {
    Wallet: typeof Wallet;
    registerAdapter: RegisterWalletAdapterType;
    adapters: WalletAdapterListType & typeof adapterList;
};
