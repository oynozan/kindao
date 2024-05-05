
/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */

const mainnet = {
    name: 'TronGrid Mainnet',
    host: 'https://api.trongrid.io',
    event: 'https://api.trongrid.io',
    explorer: 'https://tronscan.org/'
}

const testnet = {
    name: 'TronGrid Nile Testnet',
    host: 'https://nile.trongrid.io',
    event: 'https://event.nileex.io',
    explorer: 'https://nile.tronscan.org/'
}

export default  {
    network: testnet,
    privateKey: ''
}