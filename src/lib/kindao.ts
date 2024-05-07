import type { WalletInterface, ContractInterface } from '@multiplechain/types'
import type * as TronType from '@/lib/tron/browser/index'
import * as TronDefault from '@/lib/tron/index.es.js'
import abi from './abi.json'

interface Contract extends ContractInterface {
    setTronContract: () => Promise<void>;
    tronContract: any;
}

export class KinDAO {

    provider: typeof TronType;

    wallet: WalletInterface | null;

    address = "TXcGERcQosLXKojHvjt8yK5hT1MVC4kx7d";

    setContract: () => Promise<void>;

    contract: Contract;

    tronContract: any;

    constructor(wallet: WalletInterface, provider?: TronType.Provider | null) {
        this.wallet = wallet;
        this.provider = provider ?? TronDefault.Provider.instance
        this.contract = new TronDefault.assets.Contract(this.address, this.provider, abi)
        this.setContract = async () => {
            await this.contract.setTronContract()
            this.tronContract = this.contract.tronContract
        }
    }

    async isAdmin(address: string): Promise<boolean> {
        return this.contract.callMethod("isAdmin", address);
    }
}