# Hardhat example: hello-world

## Table of contents

- [About](#about)
- [Setup an empty Hardhat project](#setup-an-empty-Hardhat-project)
- [Configure hardhat](#configure-hardhat)
- [Add a smart contract](#add-a-smart-contract)
- [Add a test](#add-a-test)
- [Add a script](#add-a-script)
- [Summary](#summary)

## About

This is a basic example on how to setup your Hardhat development environment as well as testing and
deployment configuration to be compatible with Selendra EVM+. It contains a rudimentary
[HelloWorld](./contracts/HelloWorld.sol) smart contract and the required configurations and scripts
in order to test and deploy it.

## Setup an empty Hardhat project

Assuming you have your local tooling [ready to develop](https://hardhat.org/tutorial/setting-up-the-environment.html)
with Hardhat, we can jump right into creating a new Hardhat project.

1. Open a terminal window in a directory where you want your hello-world example to reside and
create a directory for it and then initialize a yarn project within it, as well as add Hardhat as a
development dependency, with the following commands:

```shell
mkdir hello-world
cd hello-world
yarn init --yes
yarn add --dev hardhat
```

2. Initialize a Hardhat project using:

```shell
yarn exec hardhat
```

3. When the Hardhat setup prompt appears, pick `Create an empty hardhat.config.js`, as we will be
configuring Harhdat manually:

```shell
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.6.8 👷‍

? What do you want to do? … 
  Create a basic sample project
  Create an advanced sample project
  Create an advanced sample project that uses TypeScript
❯ Create an empty hardhat.config.js
  Quit
```

4. Add `ethers`, `waffle`, `chai` and `eth-providers` plugins with:

```shell
yarn add --dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai @selendra/eth-providers
```

## Configure Hardhat

Your `hardhat.config.js` should come with an example configuration, which we will be replacing, in
order to be able to use the local development network with Selendra EVM+.

Import the `@nomiclabs/hardhat-waffle` dependency into `hardhat.config.js`, by adding the following
line of code to the top of the config:

```js
require("@nomiclabs/hardhat-waffle");
```

Update the `solidity` version to `0.8.9`, as this is the version used in the example:

```js
solidity: "0.8.9"
```

Below the `solidity` configuration, let's add the network configuration, so that Hardhat will be
able to connect to our local selendra development node:

```js
networks: {
  selendraLocal: {
    url: 'http://127.0.0.1:8545',
    accounts: {
      mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
      path: "m/44'/60'/0'/0",
    },
    chainId: 200
  },
},
```

Let's break this configuration down a bit:
- The port `8545` used in the node URL is the port provided by the
[ETH-RPC adapter](https://github.com/SelendraNetwork/bodhi.js/tree/master/eth-rpc-adapter), which is
connected to our local development network.
- `mnemonic` used in the `accounts` section represents derivation mnemonic used to derive the
default development accounts of the local development network.
- `path` used in the `accounts` section defines the account derivation path to be used with the
given mnemonic
- `chainId` of `200` is the default chain ID of the local development network.

In addition to the local development network, we can also add the network configuration for the
public development network. Most of the parameters are the same as for the local development network
(unless you plan on using your own development accounts). The only change that we need to do is to
change the URL of the network from `http://127.0.0.1:8545` to `https://testnet-evm.selendra.org`. The
following should be added to the `network`  section of the `hardhat.config.js`:

```
    selendraTestnet: {
      url: 'https://testnet-evm.selendra.org',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0",
      },
      chainId: 204,
    },
```

We have to configure the `mocha` timeout to equal 100 seconds. This way we ensure that our scripts
and tests don't fail while waiting for the RPC node response. We do this by adding the `mocha`
section below the `networks` section and set the `timeout` value to `100000` miliseconds:

```javascript
  mocha: {
    timeout: 100000
  },
```

This concludes the configuration of Hardhat. Now we can move on to the smart contract development.

<details>
    <summary>Your hardhat.config.js should look like this:</summary>

    require("@nomiclabs/hardhat-waffle");

    /**
    * @type import('hardhat/config').HardhatUserConfig
    */
    module.exports = {
      solidity: "0.8.9",
      networks: {
        selendraLocal: {
          url: 'http://127.0.0.1:8545',
          accounts: {
            mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
            path: "m/44'/60'/0'/0",
          },
          chainId: 200,
        },
        selendraTestnet: {
          url: 'https://testnet-evm.selendra.org',
          accounts: {
            mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
            path: "m/44'/60'/0'/0",
          },
          chainId: 204,
        },
      },
      mocha: {
        timeout: 100000
      },
    };
</details>

## Add a smart contract

In this tutorial we will be adding a simple smart contract that only stores one value that we can
query: `Hello World!`. To do that, we have to create a directory called `contracts` and create a
`HelloWorld.sol` file within it:

```solidity
mkdir contracts && touch contracts/HelloWorld.sol
```

As the example is pretty simple, we won't be going into too much detail on how it is structured. We
are using Solidity version `0.8.9` and it contains a public `helloWorld` variable, to which we
assign the value `Hello World!`. It is important to set the visibility of this variable to public,
so that the compiler builds a getter function for it. The following code should be copy-pasted into
the `HelloWorld.sol`:

```solidity
pragma solidity =0.8.9;

contract HelloWorld{
    string public helloWorld = 'Hello World!';

    constructor() {}
}
```

Now that we have the smart contract ready, we have to compile it. For this, we will add the `build`
script to the `package.json`. To do this, we have to add `scripts` section to it. We will be using
Hardhat's compile functionality, so the `scripts` section should look like this:

```json
  "scripts": {
    "build": "hardhat compile"
  }
```

When you run the `build` command using `yarn build`, the `artifacts` directory is created and it
contains the compiled smart contract.

## Add a test

To add a test, for the smart contract we just created, create a `test` directory and, within it, a
`HelloWorld.js` file:

```shell
mkdir test && touch test/HelloWorld.js
```

On the first line of the test, import the `expect` from `chai` dependency and
`calcEthereumTransactionParams` from `eth-providers`. We also set two constants to be used within
the tests:

```js
const { expect } = require("chai");
const { calcEthereumTransactionParams } = require("@selendra/eth-providers");

const txFeePerGas = '199999946752';
const storageByteDeposit = '100000000000000';
```

We will be wrapping our test within a `describe` block, so add it below the import statement:

```js
describe("HelloWorld contract", function () {

});
```

Within the `describe` block, we set the `ethParams` from the `eth-providers` dependency (we won't be
using all of them, but they are added to the example for reference), then we first get the contract
factory and then deploy it, passing the transaction parameters within the deployment transaction.
Once the smart contract is deployed, we can call the `helloWorld()` function, that was automatically
generated because we made the `helloWorld` variable public and store the result. We compare that
result to the `Hello World!` string and if everything is in order, our test should pass. Adding
these steps to the `describe` block, requires us to place them within the `it` block, which we in
turn place within the `describe` block:

```js
    it("returns the right value after the contract is deployed", async function () {
        const blockNumber = await ethers.provider.getBlockNumber();

        const ethParams = calcEthereumTransactionParams({
          gasLimit: '2100001',
          validUntil: (blockNumber + 100).toString(),
          storageLimit: '64001',
          txFeePerGas,
          storageByteDeposit
        });

        const HelloWorld = await ethers.getContractFactory("HelloWorld");

        const instance = await HelloWorld.deploy({
            gasPrice: ethParams.txGasPrice,
            gasLimit: ethParams.txGasLimit,
        });

        const value = await instance.helloWorld();

        expect(value).to.equal("Hello World!");
    });
```

With that, our test is ready to be run.

<details>
    <summary>Your test/HelloWorld.js should look like this:</summary>

    const { expect } = require("chai");
    const { calcEthereumTransactionParams } = require("@selendra/eth-providers");

    const txFeePerGas = '199999946752';
    const storageByteDeposit = '100000000000000';

    describe("HelloWorld contract", function () {
        it("returns the right value after the contract is deployed", async function () {
            const blockNumber = await ethers.provider.getBlockNumber();
          
            const ethParams = calcEthereumTransactionParams({
                gasLimit: '2100001',
                validUntil: (blockNumber + 100).toString(),
                storageLimit: '64001',
                txFeePerGas,
                storageByteDeposit
            });

            const HelloWorld = await ethers.getContractFactory("HelloWorld");
            
            const instance = await HelloWorld.deploy({
                gasPrice: ethParams.txGasPrice,
                gasLimit: ethParams.txGasLimit,
            });

            const value = await instance.helloWorld();

            expect(value).to.equal("Hello World!");
        });
    });

</details>

To be able to run the tests, we will add three additional scripts to the `package.json`. One to run
the test in the Hardhat's built-in network (this is a very fast option), one to run the tests on
a local development network and one to run the tests in the public test network. This way you can
verify the expected behaviour on Selendra EVM+. We have to specify that only `HelloWorld.js` test
script is run. Add these three lines to the `scripts` section of your `package.json`:

```json
    "test": "hardhat test test/HelloWorld.js",
    "test-selendra:local": "hardhat test test/HelloWorld.js --network selendraLocal",
    "test-selendra:testnet": "hardhat test test/HelloWorld.js --network selendraTestnet"
```

As you can see, the `test-selendra:local` and `test-selendra:testnet` script differ from `test` script in
the `--network` flag which we use to tell Hardhat to use the `selendraLocal` or `selendraTestnet` network
configuration from `hardhat.config.js` that we added in the beginning of this tutorial.

When you run the test with (for example) `yarn test`, your tests should pass with the following
output:

```shell
yarn test


yarn run v1.22.15
warning ../../../../../package.json: No license field
$ hardhat test


  HelloWorld contract
    ✓ returns the right value after the contract is deployed (1558ms)


  1 passing (2s)

✨  Done in 3.53s.
```

## Add a script

### Transaction helper utility

In order to be able to deploy your smart contract to the Selendra EVM+ using Hardhat, you need to pass
custom transaction parameters to the deploy transactions. We could add them directly to the script,
but this becomes cumbersome and repetitive as our project grows. To avoid the repetitiveness, we
will create a custom transaction helper utility, which will use `calcEthereumTransactionParams` from
`@selendra/eth-providers` dependency.

First we need to add the dependency to the project:

```shell
yarn add --dev @selendra/eth-providers
```

Now that we have the required dependency added to the project, we can create the utility:

```shell
mkdir utils && touch utils/transactionHelper.js
```

The `calcEthereumTransactionParams` is imported at the top of the file and let's define the
`txParams()` below it:

```javascript
const { calcEthereumTransactionParams } = require("@selendra/eth-providers");

async function txParams() {

}
```

Within the `txParams()` function, we set the parameters needed to be passed to the
`calcEthereumTransactionParams` and then assign its return values to the `ethParams`. At the end of
the function we return the gas price and gas limit needed to deploy a smart contract:

```javascript
    const txFeePerGas = '199999946752';
    const storageByteDeposit = '100000000000000';
    const blockNumber = await ethers.provider.getBlockNumber();

    const ethParams = calcEthereumTransactionParams({
      gasLimit: '31000000',
      validUntil: (blockNumber + 100).toString(),
      storageLimit: '64001',
      txFeePerGas,
      storageByteDeposit
    });

    return {
        txGasPrice: ethParams.txGasPrice,
        txGasLimit: ethParams.txGasLimit
    };
```

In order to be able to use the `txParams` from our new utility, we have to export it at the bottom
of the utility:

```javascript
module.exports = { txParams };
```

This concludes the `transactionHelper` and we can move on to writing the deploy script where we will
use it.

<details>
    <summary>Your utils/transactionHelper.js should look like this:</summary>

    const { calcEthereumTransactionParams } = require("@selendra/eth-providers");

    async function txParams() {
        const txFeePerGas = '199999946752';
        const storageByteDeposit = '100000000000000';
        const blockNumber = await ethers.provider.getBlockNumber();

        const ethParams = calcEthereumTransactionParams({
          gasLimit: '31000000',
          validUntil: (blockNumber + 100).toString(),
          storageLimit: '64001',
          txFeePerGas,
          storageByteDeposit
        });

        return {
            txGasPrice: ethParams.txGasPrice,
            txGasLimit: ethParams.txGasLimit
        };
    }

    module.exports = { txParams };

</details>

### Script

Finally let's add a script that deploys the example smart contract. To do this, we first have to add
a `scripts` directory and place `deploy.js` within it:

```shell
mkdir scripts && touch scripts/deploy.js
```

Within the `deploy.js` we will have the definition of main function called `main()` and then run it.
Above it, we add the import statement for `txParams` from the `transactionHelper`that we created in
the previous subsection. Its return values are used to be passed as transaction parameters. We do
this by placing the following code within the file:

```js
const { txParams } = require("../utils/transactionHelper");

async function main() {
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

At the beginning of the `main()` function definition we invoke the `txParams` and assign its return
values to the `ethParams`:

```js
  const ethParams = await txParams();
```

Our deploy script will reside in the definition (`async function main()`). First we will get
the address of the account which will be used to deploy the smart contract. Then we get the
`HelloWorld.sol` to the contract factory and deploy it, while passing the transaction parameters
defined at the beginning of the `main()` function and assign the deployed smart contract to the
`instance` variable, which we ensure that is deployed. Assigning the `instance` variable is optional
and is only done, so that we can output the value returned by the `helloWorld()` getter to the
terminal. We do it by calling `helloWorld()` from instance and outputting the result using
`console.log()`:

```js
  const [deployer] = await ethers.getSigners();

  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const instance = await HelloWorld.deploy({
    gasPrice: ethParams.txGasPrice,
    gasLimit: ethParams.txGasLimit,
  });

  await instance.deployed();

  const value = await instance.helloWorld();

  console.log("Stored value:", value);
```

<details>
    <summary>Your script/deploy.js should look like this:</summary>

    const { txParams } = require("../utils/transactionHelper");

    async function main() {
      const ethParams = await txParams();

      const [deployer] = await ethers.getSigners();

      const HelloWorld = await ethers.getContractFactory("HelloWorld");
      const instance = await HelloWorld.deploy({
        gasPrice: ethParams.txGasPrice,
        gasLimit: ethParams.txGasLimit,
      });

      await instance.deployed();

      const value = await instance.helloWorld();

      console.log("Stored value:", value);
    }

    main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });

</details>

All that is left to do, is update the `scripts` section in the `package.json` with the `deploy`,
`deploy-selendra:local` and `deploy-selendra:testnet` scripts. Once again, we are adding three scripts,
so that we can deploy to the built-in network as well as the local development network and to
the public test network. To add these scripts to your project, place the following three lines
within `scripts` section of the `package.json`:

```json
    "deploy": "hardhat run scripts/deploy.js",
    "deploy-selendra:local": "hardhat run scripts/deploy.js --network selendraLocal",
    "deploy-selendra:testnet": "hardhat run scripts/deploy.js --network selendraTestnet",
```

Running the `yarn deploy` script should return the following output:

```shell
yarn deploy


yarn run v1.22.15
warning ../../../../../package.json: No license field
$ hardhat run scripts/deploy.js
Stored value: Hello World!
✨  Done in 7.81s.
```

## Summary

We have initiated an empty Hardhat project and configured it to work with Selendra EVM+. We added a
`HelloWorld.sol` smart contract, that can be compiled using `yarn build`, and wrote tests for it,
which can be run using `yarn test`, `yarn test-selendra:local` or `yarn test-selendra:testnet`.
Additionally we added the deploy script, that can be run using `yarn deploy`, `yarn deploy-selendra:local`
or `yarn deploy-selendra:testnet`.
