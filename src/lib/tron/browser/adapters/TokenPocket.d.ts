import { WalletAdapterInterface } from '@multiplechain/types';

declare global {
    interface Window {
        tokenpocket?: {
            tron: any;
        };
    }
}
declare const TokenPocket: WalletAdapterInterface;
export default TokenPocket;
