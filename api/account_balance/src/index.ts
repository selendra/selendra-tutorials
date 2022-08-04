import { options } from "@selendra/api";
import { ApiPromise, WsProvider } from "@polkadot/api";

async function main() {
  const provider = new WsProvider("wss://rpc-testnet.selendra.org");
  const api = new ApiPromise(options({ provider }));
  await api.isReadyOrError;

  const address = "seZesjRJ9dwjGGLtxcHAtDbWMzJnQQJL56Nn5zUb3CV847Hf9";
  const evmAddress = "0x75E480dB528101a381Ce68544611C169Ad7EB342";
  const accountData = await api.query.system.account(address);
  console.log(accountData.toHuman());

  // KUSD
  const tokenData = await api.query.tokens.accounts(address, {
    Token: "KUSD",
  });
  console.log(tokenData.toHuman());

  // LSEL
  const stableAssetPoolData = await api.query.tokens.accounts(address, { StableAssetPoolToken: 0 });
  console.log(stableAssetPoolData.toHuman());

  // EVM
  const evmAssetData = await api.query.tokens.accounts(address, { ERC20: evmAddress });
  console.log(evmAssetData.toHuman());
  

}

main().then(() => process.exit(0));