import fs from 'fs'
import config from './config'
import TronWeb from 'tronweb'

interface Deployed {
    contractAddress: string;
    transactionHash: string;
}

export async function deploy(): Promise<Deployed> {
    const artifacts = await import('../artifacts/contracts/KinDAO.sol/KinDAO.json')

    return new Promise(async (resolve, reject) => {

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
            reject(new Error(`Failed to deploy contract: ${result.code}`));
        }

        const transactionHash = result.transaction.txID;
        const contractAddress = tronWeb.address.fromHex(result.transaction.contract_address);

        fs.writeFileSync(
            './deployed.json',
            JSON.stringify({ contractAddress, transactionHash }, null, 2)
        );

        resolve({ contractAddress, transactionHash });
    })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy()
.then((result: Deployed) => {
    console.log('Contract deployed to:', result.contractAddress);
    console.log('Transaction hash:', result.transactionHash);
    process.exit(0)
})
.catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
