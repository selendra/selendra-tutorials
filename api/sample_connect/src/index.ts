import { options } from "@selendra/api";
import { ApiPromise, WsProvider } from "@polkadot/api";

async function main() {
  const provider = new WsProvider("wss://rpc-testnet.selendra.org");
  const api = new ApiPromise(options({ provider }));
  await api.isReadyOrError;

  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );
}

main().then(() => process.exit(0));