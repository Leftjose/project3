import { getPublicClient, getAccountClient } from "./utils";
import { abi } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { parseEther } from 'viem';

const getParameters = () => {
  const parameters = process.argv.slice(2);
  const amount = parameters[0];
  const contractAddress = parameters[1] as `0x${string}`;

  return { 
    account: getAccountClient(), 
    amount, 
    contractAddress,
    publicClient: getPublicClient("Alchemy")
  };
}

async function main() {
  const { account, amount, contractAddress, publicClient } = getParameters();

  const hash = await account.writeContract({
    address: contractAddress,
    abi,
    functionName: "mint",
    args: [account.account.address, parseEther(amount)],
  })

  console.log("Transaction hash: ", hash);
  console.log("Waiting for confirmations");
  await publicClient.waitForTransactionReceipt({ hash });
  console.log("Minted ", amount, " to ", account.account.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});