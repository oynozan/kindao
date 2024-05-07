import type { WalletInterface, ContractInterface } from '@multiplechain/types'
import type * as TronType from '@/lib/tron/browser/index'
import * as TronDefault from '@/lib/tron/index.es.js'
import type TronWeb from 'tronweb';
import abi from './abi.json'

const utils = TronDefault.utils

interface Contract extends ContractInterface {
    setTronContract: () => Promise<void>;
    tronContract: any;
}

export interface Profile {
    username: string;
    avatarUrl: string;
    earned: number;
}

export interface Proposal {
    id: string;
    title: string;
    description: string;
    creator: string;
    bounty: number;
    createdAt: number;
    isFinalized: boolean;
}

export interface Fact {
    id: string;
    proposalId: string;
    title: string;
    description: string;
    sourceMediaUrl: string;
    voteUp: number;
    voteDown: number;
    createdAt: number;
    creator: string;
}

export interface Vote {
    isUp: boolean;
    factId: string;
    voter: string;
}

interface ParameterInterface {
    value: {
        data: string;
        token_id: number;
        owner_address: string;
        call_token_value: number;
        contract_address: string;
    };
    type_url: string;
}

interface ContractDataInterface {
    parameter: ParameterInterface;
    type: string;
}

export interface TransactionData {
    visible: boolean;
    txID: string;
    raw_data: {
        contract: ContractDataInterface[];
        ref_block_bytes: string;
        ref_block_hash: string;
        expiration: number;
        fee_limit: number;
        timestamp: number;
    };
    raw_data_hex: string;
}

export class KinDAO {

    provider: TronType.Provider;

    wallet: WalletInterface;

    address = "TNSMH37nhxsNMXZaqr3dGTEH6FyUffzoY6";

    tokenAddress = "TY9dAUUAvFVkSMjfFncnZnVyoFD59c7QY4";

    setContract: () => Promise<void>;

    contract: Contract;

    tronContract: any;

    tronWeb: TronWeb;

    token: TronType.assets.Token;

    constructor(wallet: WalletInterface, provider?: TronType.Provider | null) {
        this.wallet = wallet;
        this.provider = provider ?? TronDefault.Provider.instance
        this.tronWeb = this.provider.tronWeb
        this.contract = new TronDefault.assets.Contract(this.address, this.provider, abi)
        this.token = new TronDefault.assets.Token(this.tokenAddress, this.provider, undefined)
        this.setContract = async () => {
            await this.contract.setTronContract()
            this.tronContract = this.contract.tronContract
        }
    }

    async createTx(method: string, ...args: any[]): Promise<TransactionData | false> {
        const address = await this.wallet.getAddress();
        const data = await this.contract.createTransactionData(method, address, ...args);
        data.options.feeLimit = 100000000
        return await this.provider.tronWeb.triggerContract(data)
    }

    async isAdmin(address: string): Promise<boolean> {
        return this.contract.callMethod("isAdmin", address);
    }

    async addAdmin(address: string): Promise<string> {
        const result = await this.createTx("addAdmin", address);

        if (result === false) {
            throw new Error(TronDefault.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new TronDefault.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async removeAdmin(address: string): Promise<string> {
        const result = await this.createTx("removeAdmin", address);

        if (result === false) {
            throw new Error(TronDefault.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new TronDefault.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async createProfile(username: string, avatarUrl: string = ''): Promise<string> {
        const result = await this.createTx("createProfile", username, avatarUrl);

        if (result === false) {
            throw new Error(TronDefault.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new TronDefault.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async updateProfile(username: string, avatarUrl: string = ''): Promise<string> {
        const result = await this.createTx("updateProfile", username, avatarUrl);

        if (result === false) {
            throw new Error(TronDefault.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new TronDefault.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async approveToken(amount: number): Promise<string> {
        return this.wallet.sendTransaction(await this.token.approve(await this.wallet.getAddress(), this.address, amount))
    }

    async createProposal(title: string, description: string, bounty: number): Promise<string> {

        const tokenBalance = await this.token.getBalance(await this.wallet.getAddress());

        if (tokenBalance < bounty) {
            throw new Error(TronDefault.types.ErrorTypeEnum.INSUFFICIENT_BALANCE)
        }

        const hexAmount = TronDefault.utils.numberToHex(bounty, await this.token.getDecimals());

        const result = await this.createTx("createProposal", title, description, hexAmount);

        if (result === false) {
            throw new Error(TronDefault.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new TronDefault.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async finalizeProposal(proposalId: string): Promise<string> {
        const result = await this.createTx("finalizeProposal", proposalId);

        if (result === false) {
            throw new Error(TronDefault.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new TronDefault.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async createFact(proposalId: string, title: string, description: string, sourceMediaUrl: string): Promise<string> {
        const result = await this.createTx("createFact", proposalId, title, description, sourceMediaUrl);

        if (result === false) {
            throw new Error(TronDefault.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new TronDefault.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async voteFact(proposalId: string, factId: string, isUp: boolean): Promise<string> {
        const result = await this.createTx("voteFact", proposalId, factId, isUp);

        if (result === false) {
            throw new Error(TronDefault.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new TronDefault.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async getProfiles(startIndex: number = 0, endIndex: number = 10): Promise<Profile[]> {
        const profiles = await this.contract.callMethod("getProfiles", startIndex, endIndex);
        return profiles.map((profile: any) => ({
            username: profile.username,
            avatarUrl: profile.avatarUrl,
            earned: utils.hexToNumber(profile.earned, 18)
        }));
    }

    async getProposals(startIndex: number = 0, endIndex: number = 10): Promise<Proposal[]> {
        const proposals = await this.contract.callMethod("getProposals", startIndex, endIndex);
        return proposals.map((proposal: any) => ({
            id: proposal.id,
            title: proposal.title,
            description: proposal.description,
            creator: proposal.creator,
            bounty: utils.hexToNumber(proposal.bounty, 18),
            createdAt: Number(proposal.createdAt),
            isFinalized: proposal.isFinalized
        }));
    }

    async getFacts(proposalId: string, startIndex: number = 0, endIndex: number = 10): Promise<Fact[]> {
        const facts = await this.contract.callMethod("getFacts", proposalId, startIndex, endIndex);
        return facts.map((fact: any) => ({
            id: fact.id,
            proposalId: fact.proposalId,
            title: fact.title,
            description: fact.description,
            sourceMediaUrl: fact.sourceMediaUrl,
            voteUp: Number(fact.voteUp),
            voteDown: Number(fact.voteDown),
            createdAt: Number(fact.createdAt),
            creator: fact.creator
        }));
    }

    async getFactsLength(proposalId: string): Promise<number> {
        return this.contract.callMethod("getFactsLength", proposalId);
    }

    async getDeservedFacts(proposalId: string): Promise<Fact[]> {
        const facts = await this.contract.callMethod("getDeservedFacts", proposalId);
        return facts.map((fact: any) => ({
            id: fact.id,
            proposalId: fact.proposalId,
            title: fact.title,
            description: fact.description,
            sourceMediaUrl: fact.sourceMediaUrl,
            voteUp: Number(fact.voteUp),
            voteDown: Number(fact.voteDown),
            createdAt: Number(fact.createdAt),
            creator: fact.creator
        }));
    }

    async getVotes(factId: string): Promise<Vote[]> {
        const votes = await this.contract.callMethod("getVotes", factId);
        return votes.map((vote: any) => ({
            isUp: vote.isUp,
            factId: vote.factId,
            voter: vote.voter
        }));
    }

    async getProfile(address: string): Promise<Profile> {
        const profile = await this.contract.callMethod("getProfile", address);
        return {
            username: profile.username,
            avatarUrl: profile.avatarUrl,
            earned: utils.hexToNumber(profile.earned, 18)
        };
    }

    async getProposal(proposalId: string): Promise<Proposal> {
        const proposal = await this.contract.callMethod("getProposal", proposalId);
        return {
            id: proposal.id,
            title: proposal.title,
            description: proposal.description,
            creator: proposal.creator,
            bounty: utils.hexToNumber(proposal.bounty, 18),
            createdAt: Number(proposal.createdAt),
            isFinalized: proposal.isFinalized
        };
    }

    async getFact(proposalId: string, factId: string): Promise<Fact> {
        const fact = await this.contract.callMethod("getFact", proposalId, factId);
        return {
            id: fact.id,
            proposalId: fact.proposalId,
            title: fact.title,
            description: fact.description,
            sourceMediaUrl: fact.sourceMediaUrl,
            voteUp: Number(fact.voteUp),
            voteDown: Number(fact.voteDown),
            createdAt: Number(fact.createdAt),
            creator: fact.creator
        };
    }

    async getVote(factId: string, address: string): Promise<Vote> {
        const vote = await this.contract.callMethod("getVote", factId, address);
        return {
            isUp: vote.isUp,
            factId: vote.factId,
            voter: vote.voter
        };
    }

    async withdraw(): Promise<string> {
        const result = await this.createTx("withdraw");

        if (result === false) {
            throw new Error(TronDefault.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new TronDefault.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

}