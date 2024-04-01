import { getPublicClient, getAccountClient } from "./utils";
import { abi } from "../artifacts/contracts/MyToken.sol/MyToken.json";

const getParameters = () => {
  const parameters = process.argv.slice(2);
  const address = parameters[0] as `0x${string}`;
  const amount = parameters[1];
  const contractAddress = parameters[2] as `0x${string}`;

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
    args: [account.account.address, amount],
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