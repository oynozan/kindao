import { WalletAdapterInterface } from '@multiplechain/types';

declare global {
    interface Window {
        bitkeep?: {
            tronLink?: boolean;
        };
    }
}
declare const BitgetWallet: WalletAdapterInterface;
export default BitgetWallet;
