require('@nomiclabs/hardhat-waffle');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.9',
  networks: {
    selendraLocal: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0"
      },
      chainId: 200
    },
    selendraTestnet: {
      url: 'https://testnet-evm.selendra.org',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0"
      },
      chainId: 204
    },
  },
  mocha: {
    timeout: 100000
  }
};
