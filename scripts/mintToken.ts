import { viem } from "hardhat";
async function main() {
  const publicClient = await viem.getPublicClient();
  const [deployer, acc1, acc2] = await viem.getWalletClients();
  const contract = await viem.deploy
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});