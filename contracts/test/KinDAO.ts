import { expect } from "chai";
import { ethers } from "hardhat";
import { KinDAO, KDAO } from '../typechain-types';
import { EventLog, Log, type Signer as EtherSigner } from "ethers";

interface Signer extends EtherSigner {
    address: string;
}

describe("KinDAO", () => {
    let owner: Signer;
    let admin: Signer;
    let propCreator: Signer;
    let voter1: Signer;
    let voter2: Signer;
    let token: KDAO;
    let contract: KinDAO;
    let tokenAddress: string;
    let proposalId: string
    let factIds: string[] = [];

    let factCreator1: Signer, factCreator2: Signer, factCreator3: Signer, factCreator4: Signer, factCreator5: Signer;

    const bounty = 500;
    const notAdmin = "0x74dBE9cA4F93087A27f23164d4367b8ce66C33e2";

    const tokenFormat = async (amount: number) => {
        return '0x' + (BigInt(amount) * 10n ** await token.decimals()).toString(16);
    }

    const fromTokenFormat = async (amount: BigInt) => {
        return Number(amount) / 10 ** Number(await token.decimals());
    }

    before(async function () {
        [owner, admin, propCreator, voter1, voter2] = await ethers.getSigners();
        [factCreator1, factCreator2, factCreator3, factCreator4, factCreator5] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("KDAO");
        token = (await Token.deploy()) as KDAO;
        tokenAddress = await token.getAddress();
        const KinDAO = await ethers.getContractFactory("KinDAO");
        contract = (await KinDAO.deploy(owner.address, tokenAddress)) as KinDAO;
    });

    it('Add admin', async function () {
        await contract.addAdmin(admin.address);
        expect(await contract.isAdmin(admin.address)).to.be.true;
        expect(await contract.isAdmin(notAdmin)).to.be.false;
    })

    it('Remove admin', async function () {
        await contract.removeAdmin(admin.address);
        expect(await contract.isAdmin(admin.address)).to.be.false;
    })

    describe('Profile', function () {
        it('Check profile', async function () {
            expect((await contract.getProfile(propCreator.address))[0]).to.be.false;
        })

        it('Create profile', async function () {
            await contract.connect(propCreator).createProfile('beycan', 'example');
            await contract.connect(propCreator).updateProfile('deleted', 'example');
            expect((await contract.getProfile(propCreator.address))[0]).to.be.true;
        })

        it('Try username', async function () {
            await contract.connect(voter1).createProfile('beycan', 'example');
            expect((await contract.getProfile(voter1.address))[0]).to.be.true;
        })

        it('Get profiles', async function () {
            const result = await contract.getProfiles(0, 1);
            expect(result.length).to.be.equal(1);
        })
    })

    describe('Proposal', function () {

        it('Send utility token', async function () {
            await token.connect(owner).transfer(propCreator.address, await tokenFormat(bounty));
            expect(await token.balanceOf(propCreator.address)).to.be.equal(await tokenFormat(bounty));
        })

        it('Approve utility token', async function () {
            await token.connect(propCreator).approve(contract.getAddress(), await tokenFormat(bounty));
            expect(await token.allowance(propCreator.address, contract.getAddress())).to.be.equal(await tokenFormat(bounty));
        })

        it('Create proposal', async function () {
            const tx = await contract.connect(propCreator).createProposal('Prop Title', 'Prop Desc', await tokenFormat(bounty));
            const receipt = await tx.wait();

            if (receipt == null) { 
                expect.fail('receipt is null');
            }

            const event = receipt.logs.find((e: EventLog | Log) => {
                return (e as EventLog).eventName === 'ProposalCreated';
            }) as EventLog;

            expect(event.args[3]).to.be.equal(propCreator.address);

            proposalId = event.args[0];
    
            expect((await contract.getProposal(proposalId))[0]).to.be.true
        })

        it('Check balance', async function () {
            expect(await token.balanceOf(contract.getAddress())).to.be.equal(await tokenFormat(bounty));
        })
    })

    describe('Fact', function () {
        const createFact = async (creator: Signer, title: string) => {
            const tx = await contract.connect(creator).createFact(
                proposalId,
                title,
                'Fact Desc',
                'https://example.com'
            );

            const receipt = await tx.wait();

            if (receipt == null) { 
                expect.fail('receipt is null');
            }

            const event = receipt.logs.find((e: EventLog | Log) => {
                return (e as EventLog).eventName === 'FactCreated';
            }) as EventLog;

            expect(event.args[0]).to.be.equal(proposalId);

            factIds.push(event.args[1]);

            expect((await contract.getFact(proposalId, factIds[0]))[0]).to.be.true;
        }
        it('Create fact', async function () {
            await createFact(factCreator1, 'Fact Title 1');
            await createFact(factCreator2, 'Fact Title 2');
            await createFact(factCreator3, 'Fact Title 3');
            await createFact(factCreator4, 'Fact Title 4');
            await createFact(factCreator5, 'Fact Title 5');
        })
    })

    describe('Vote', function () {
        it('Vote', async function () {
            expect((await contract.getVotes(factIds[0])).length).to.be.equal(0);
        })

        it('VoteFact', async function () {
            await (await contract.connect(voter1).voteFact(proposalId, factIds[0], true)).wait();
            await (await contract.connect(voter2).voteFact(proposalId, factIds[0], true)).wait();
            await (await contract.connect(voter1).voteFact(proposalId, factIds[2], true)).wait();
            await (await contract.connect(voter2).voteFact(proposalId, factIds[2], true)).wait();
            await (await contract.connect(voter1).voteFact(proposalId, factIds[1], false)).wait();
            expect((await contract.getVotes(factIds[0])).length).to.be.equal(2);
        })

        it('Check upVote', async function () {
            expect((await contract.getFact(proposalId, factIds[0]))[1][5]).to.be.equal(2);
        })

        it('downVote', async function () {
            await (await contract.connect(voter1).voteFact(proposalId, factIds[0], false)).wait();
            expect((await contract.getVotes(factIds[0]))[0][0]).to.be.false;
        })

        it('Finalize proposal', async function () {
            await contract.connect(owner).finalizeProposal(proposalId);
            expect((await contract.getProposal(proposalId))[1][6]).to.be.true;
        })
    })

    describe('Data', function () {
        it('Get proposal', async function () {
            const result = await contract.getProposal(proposalId);
            expect(result[0]).to.be.true;
            const [id, title, desc, creator, _bounty, timeStamp, isFinalized] = result[1];
            expect(title).to.be.equal('Prop Title');
            expect(desc).to.be.equal('Prop Desc');
            expect(creator).to.be.equal(propCreator.address);
            expect(_bounty).to.be.equal(await tokenFormat(bounty));
            expect(timeStamp).to.be.an('bigint');
            expect(isFinalized).to.be.true;
        })

        it('Get fact', async function () {
            const result = await contract.getFact(proposalId, factIds[0]);
            expect(result[0]).to.be.true;
            const [
                id,
                propId,
                title,
                desc,
                url,
                upVote,
                downVote,
                timeStamp,
                creator
            ] = result[1];

            expect(propId).to.be.equal(proposalId);
            expect(title).to.be.equal('Fact Title 1');
            expect(desc).to.be.equal('Fact Desc');
            expect(url).to.be.equal('https://example.com');
            expect(upVote).to.be.equal(1);
            expect(downVote).to.be.equal(1);
            expect(timeStamp).to.be.an('bigint');
            expect(creator).to.be.equal(factCreator1.address);
        })

        it('Get vote', async function () {
            const result = await contract.getVote(factIds[0], voter1.address);
            expect(result[1][0]).to.be.false;
        })

        it('Get proposals', async function () {
            const result = await contract.getProposals(0, 1);
            expect(result.length).to.be.equal(1);
        })

        it('Get facts', async function () {
            const result = await contract.getFacts(proposalId, 0, await contract.getFactsLength(proposalId));
            expect(result.length).to.be.equal(5);
        })

        it('Get votes', async function () {
            const result = await contract.getVotes(factIds[0]);
            expect(result.length).to.be.equal(2);
        })

        it('Check balance', async function () {
            expect(await token.balanceOf(contract.getAddress())).to.be.equal(await tokenFormat(15));
        })

        it('Get deserved facts', async function () {
            const result = await contract.getDeservedFacts(proposalId);
            expect(result[0][0][5]).to.be.equal(2);
            expect(result[0][1][5]).to.be.equal(1);
            expect(result[0][2][5]).to.be.equal(0);
            expect(result[0][2][6]).to.be.equal(1);
        })

        it('Get totals', async function () {
            const result = await contract.totals();
            expect(result[0]).to.be.equal(await tokenFormat(bounty));
            expect(result[1]).to.be.equal(1);
            expect(result[2]).to.be.equal(2);
            expect(result[3]).to.be.equal(5);
            expect(result[4]).to.be.equal(5);
        })

        it('Get facts with pagination', async function () {
            const result = await contract.getFacts(proposalId, 0, 2);
            expect(result.length).to.be.equal(2);
        })
    })
});
