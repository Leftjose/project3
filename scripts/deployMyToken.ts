import { formatEther } from "viem";
import { abi, bytecode } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { getPublicClient, getAccountClient } from "./utils";

async function main() {
  const publicClient = getPublicClient("Alchemy");
  const deployer = getAccountClient();

  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer Balance: ",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  console.log("Deploying MyToken contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [],
  });

  console.log("Transaction hash: ", hash);
  console.log("Waiting for confirmations");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("MyToken Contract deployed at: ", receipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
