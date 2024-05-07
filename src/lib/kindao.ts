import type { WalletInterface, ContractInterface } from '@multiplechain/types';
import type * as TronType from '@/lib/tron/browser/index';
import * as TronDefault from '@beycandeveloper/tron';
import type TronWeb from 'tronweb';
import { AbiCoder } from 'ethers';
import abi from './abi.json';

const Tron = TronDefault as typeof TronType;

const utils = Tron.utils

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    approved: boolean;
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

    wallet?: WalletInterface;

    address = "TBCeQ72Jmh9YuxXinhuHnQVx6ztCUyipeR";

    tokenAddress = "TY9dAUUAvFVkSMjfFncnZnVyoFD59c7QY4";

    setContract: () => Promise<void>;

    contract: Contract;

    tronContract: any;

    tronWeb: TronWeb;

    token: TronType.assets.Token;

    constructor(provider: TronType.Provider | null, wallet?: WalletInterface) {
        this.wallet = wallet;
        this.provider = provider ?? Tron.Provider.instance
        this.tronWeb = this.provider.tronWeb
        this.contract = new Tron.assets.Contract(this.address, this.provider, abi as any)
        this.token = new Tron.assets.Token(this.tokenAddress, this.provider, undefined)
        this.setContract = async () => {
            await this.contract.setTronContract()
            this.tronContract = this.contract.tronContract
        }
    }

    async createTx(method: string, ...args: any[]): Promise<TransactionData | false> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }
        const address = await this.wallet.getAddress();
        const data = await this.contract.createTransactionData(method, address, ...args);
        data.options.feeLimit = 10000000000
        return await this.provider.tronWeb.triggerContract(data)
    }

    async isAdmin(address: string): Promise<boolean> {
        return this.contract.callMethod("isAdmin", address);
    }

    async addAdmin(address: string): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }
        const result = await this.createTx("addAdmin", address);

        if (result === false) {
            throw new Error(Tron.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new Tron.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async removeAdmin(address: string): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }
        const result = await this.createTx("removeAdmin", address);

        if (result === false) {
            throw new Error(Tron.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new Tron.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async createProfile(username: string, avatarUrl: string = ''): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }
        const result = await this.createTx("createProfile", username, avatarUrl);

        if (result === false) {
            throw new Error(Tron.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new Tron.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async updateProfile(username: string, avatarUrl: string = ''): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }
        const result = await this.createTx("updateProfile", username, avatarUrl);

        if (result === false) {
            throw new Error(Tron.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new Tron.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async approveToken(amount: number): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }
        return this.wallet.sendTransaction(await this.token.approve(await this.wallet.getAddress(), this.address, amount))
    }

    async createProposal(title: string, description: string, bounty: number): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }

        const allowance = await this.token.getAllowance(await this.wallet.getAddress(), this.address);

        if (allowance < bounty) {
            await this.approveToken(bounty);
        }

        const tokenBalance = await this.token.getBalance(await this.wallet.getAddress());

        if (tokenBalance < bounty) {
            throw new Error(Tron.types.ErrorTypeEnum.INSUFFICIENT_BALANCE)
        }

        const hexAmount = Tron.utils.numberToHex(bounty, await this.token.getDecimals());

        const result = await this.createTx("createProposal", title, description, hexAmount);

        if (result === false) {
            throw new Error(Tron.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new Tron.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async findProposalId(txHash: string): Promise<string> {
        const tx = await this.tronWeb.trx.getUnconfirmedTransactionInfo(txHash);
        if (!tx.log) {
            await sleep(4000);
            return this.findProposalId(txHash);
        }
        const log = tx.log.find((log: any) => log.topics.length == 1);
        const decoded = AbiCoder.defaultAbiCoder().decode(["string"], "0x" + log.data);
        return decoded[0];
    }

    async finalizeProposal(proposalId: string, approvedFactId: string): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }

        const result = await this.createTx("finalizeProposal", proposalId, approvedFactId);

        if (result === false) {
            throw new Error(Tron.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new Tron.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async createFact(proposalId: string, title: string, description: string, sourceMediaUrl: string): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }

        const result = await this.createTx("createFact", proposalId, title, description, sourceMediaUrl);

        if (result === false) {
            throw new Error(Tron.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new Tron.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

    async findFactId(txHash: string): Promise<string> {
        const tx = await this.tronWeb.trx.getUnconfirmedTransactionInfo(txHash);
        if (!tx.log) {
            await sleep(4000);
            return this.findFactId(txHash);
        }
        const log = tx.log.find((log: any) => log.topics.length == 1);
        const decoded = AbiCoder.defaultAbiCoder().decode(["string", "string"], "0x" + log.data);
        return decoded[1];
    }
    
    async waitTransaction(txHash: string): Promise<void> {
        const tx = await this.tronWeb.trx.getUnconfirmedTransactionInfo(txHash);
        if (!tx.log) {
            await sleep(4000);
            return this.waitTransaction(txHash);
        }
        return;
    }

    async voteFact(proposalId: string, factId: string, isUp: boolean): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }

        const result = await this.createTx("voteFact", proposalId, factId, isUp);

        if (result === false) {
            throw new Error(Tron.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new Tron.services.TransactionSigner(result, this.provider)

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
            creator: this.tronWeb.address.fromHex(proposal.creator),
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
            creator: this.tronWeb.address.fromHex(fact.creator),
            approved: fact.approved
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
            creator: this.tronWeb.address.fromHex(fact.creator)
        }));
    }

    async getVotes(factId: string): Promise<Vote[]> {
        const votes = await this.contract.callMethod("getVotes", factId);
        return votes.map((vote: any) => ({
            isUp: vote.isUp,
            factId: vote.factId,
            voter: this.tronWeb.address.fromHex(vote.voter)
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

    async getProposal(proposalId: string): Promise<Proposal | null> {
        const proposal = await this.contract.callMethod("getProposal", proposalId);
        if (proposal[0] == false) return null;
        return {
            id: proposal[1].id,
            title: proposal[1].title,
            description: proposal[1].description,
            creator: this.tronWeb.address.fromHex(proposal[1].creator),
            bounty: utils.hexToNumber(proposal[1].bounty, 18),
            createdAt: Number(proposal[1].createdAt),
            isFinalized: proposal[1].isFinalized
        };
    }

    async getFact(proposalId: string, factId: string): Promise<Fact | null> {
        const fact = await this.contract.callMethod("getFact", proposalId, factId);
        if (fact[0] == false) return null;
        return {
            id: fact[1].id,
            proposalId: fact[1].proposalId,
            title: fact[1].title,
            description: fact[1].description,
            sourceMediaUrl: fact[1].sourceMediaUrl,
            voteUp: Number(fact[1].voteUp),
            voteDown: Number(fact[1].voteDown),
            createdAt: Number(fact[1].createdAt),
            creator: this.tronWeb.address.fromHex(fact[1].creator),
            approved: fact[1].approved
        };
    }

    async getVote(factId: string, address: string): Promise<Vote | null> {
        const vote = await this.contract.callMethod("getVote", factId, address);
        if (vote[0] == false) return null;
        return {
            isUp: vote[1].isUp,
            factId: vote[1].factId,
            voter: this.tronWeb.address.fromHex(vote[1].voter)
        };
    }

    async withdraw(): Promise<string> {
        if (!this.wallet) {
            throw new Error("Wallet not connected")
        }

        const result = await this.createTx("withdraw");

        if (result === false) {
            throw new Error(Tron.types.ErrorTypeEnum.TRANSACTION_CREATION_FAILED)
        }

        const signer = new Tron.services.TransactionSigner(result, this.provider)

        return this.wallet.sendTransaction(signer)
    }

}