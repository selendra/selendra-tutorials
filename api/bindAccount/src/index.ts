import { bindaccount } from "@selendra/bind_account";

const substrateWallet = "tone catalog traffic already because whip wide world slide pink admit divert";
const privateKey = "1570b994d8c79a9b10a8c5cd577c7fdb2b9461d01f7e84a0e07693212488a7ab";
const substrateProdiver = "wss://rpc-testnet.selendra.org";
const evmProverider = "https://testnet-evm.selendra.org";

async function main() {
    const hash = await bindaccount(substrateWallet, privateKey, substrateProdiver, evmProverider);
    console.log(hash);
}
  
main().then(() => process.exit(0));