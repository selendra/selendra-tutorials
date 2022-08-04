import { options } from "@selendra/api";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";

async function main() {
  const provider = new WsProvider("wss://rpc-testnet.selendra.org");
  const api = new ApiPromise(options({ provider }));
  await api.isReadyOrError;

  const keyring = new Keyring({ 
    type: 'sr25519',
    ss58Format: 204
  });

  // paste mnemonic here
  const testingPair = keyring.addFromMnemonic('drum reward add snap session satisfy cotton image source cluster entire law');
  const fromAddress = testingPair.address;
  const toAddress = "sebsbJgtAtc5bo9WNhDgmKgx8EF5ivUZik6DyuqrgxCirDQtm";

  const beforeAccountData = await api.query.system.account(fromAddress);
  console.log(beforeAccountData.toHuman());

  const hash = await api.tx.currencies
    .transfer(
      toAddress,
      {
        Token: "SEL",
      },
      "1000000000000"
    )
    .signAndSend(testingPair);

  console.log("Transfer sent with hash", hash.toHex());

}

main().then(() => process.exit(0));