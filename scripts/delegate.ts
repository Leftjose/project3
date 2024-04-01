import { getPublicClient, getAccountClient } from "./utils";
import { abi } from "../artifacts/contracts/MyToken.sol/MyToken.json";

const getParameters = () => {
  const parameters = process.argv.slice(2);
  const delegateAddress = parameters[0] as `0x${string}`;
  const contractAddress = parameters[1] as `0x${string}`;

  return { 
    account: getAccountClient(), 
    contractAddress,
    delegateAddress,
    publicClient: getPublicClient("Alchemy")
  };
}

async function main() {
  const { account, delegateAddress, contractAddress, publicClient } = getParameters();

  const hash = await account.writeContract({
    address: contractAddress,
    abi,
    functionName: "delegate",
    args: [delegateAddress],
  })

  console.log("Transaction hash: ", hash);
  console.log("Waiting for confirmations");
  await publicClient.waitForTransactionReceipt({ hash });
  console.log("Delegated to ", delegateAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
