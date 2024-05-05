import fs from 'fs'
import config from './config'
import TronWeb from 'tronweb'

async function main() {
    const artifacts = await import('../artifacts/contracts/KinDAO.sol/KinDAO.json')

    console.log("Deploying contracts...");

    const tronWeb = new TronWeb({
        fullNode: config.testnet.host,
        solidityNode: config.testnet.host,
        eventServer: config.testnet.event,
        privateKey: config.privateKey
    })

    const address = tronWeb.defaultAddress.base58

    const options = {
        name: "KinDAO",
        abi: artifacts.abi,
        bytecode: artifacts.bytecode,
        feeLimit: 2000000000,
        callValue: 0,
        userFeePercentage: 100,
        originEnergyLimit: 2000000,
        parameters: [
            address,
            config.tokenAddress
        ]
    }

    let tx = await tronWeb.transactionBuilder.createSmartContract(
        options, 
        address
    );
    
    const signedTx = await tronWeb.trx.sign(tx, config.privateKey);
    const result = await tronWeb.trx.sendRawTransaction(signedTx);

    if (result.code) {
        throw new Error(`Failed to deploy contract: ${result.code}`);
    }

    const transactionHash = result.transaction.txID;
    const contractAddress = tronWeb.address.fromHex(result.transaction.contract_address);

    fs.writeFileSync(
        './deployed.json',
        JSON.stringify({ contractAddress, transactionHash }, null, 2)
    );
    
    console.log(`Contract deployed at ${contractAddress}`);
    console.log(`Transaction hash: ${transactionHash}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
