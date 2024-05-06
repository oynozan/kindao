import { TransactionData } from './TransactionSigner.ts';
import { TransactionRawData } from '../assets/Contract.ts';
import { default as TronWebBase } from 'tronweb';

export declare class TronWeb extends TronWebBase {
    triggerContract(data: TransactionRawData): Promise<TransactionData | false>;
}
