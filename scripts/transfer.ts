import { getPublicClient, getAccountClient } from "./utils";
import { abi } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { parseEther } from "viem";

const getParameters = () => {
  const parameters = process.argv.slice(2);
  const amount = parseEther(parameters[0]);
  const transferTo = parameters[1];
  const contractAddress = parameters[2] as `0x${string}`;

  return { 
    account: getAccountClient(),
    transferTo,
    amount, 
    contractAddress,
    publicClient: getPublicClient("Alchemy")
  };
}

async function main() {
  const { account, transferTo, amount, contractAddress, publicClient } = getParameters();

  const hash = await account.writeContract({
    address: contractAddress,
    abi,
    functionName: "transfer",
    args: [transferTo, amount],
  })

  console.log("Transaction hash: ", hash);
  console.log("Waiting for confirmations");
  await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transfer ", amount, " to ", account.account.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});