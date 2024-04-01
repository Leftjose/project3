import { getPublicClient, getAccountClient } from "./utils";
import { abi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { parseEther } from "viem";

const getParameters = () => {
  const parameters = process.argv.slice(2);
  const proposal = parameters[0];
  const amount = parseEther(parameters[1]);
  const contractAddress = parameters[2] as `0x${string}`;

  return {
    proposal,
    account: getAccountClient(),
    amount,
    contractAddress,
    publicClient: getPublicClient("Alchemy"),
  };
};

async function main() {
  const { proposal, account, amount, contractAddress, publicClient } = getParameters();

  console.log(amount, " votes for proposal ", proposal)
  const hash = await account.writeContract({
    address: contractAddress,
    abi,
    functionName: "vote",
    args: [proposal, amount],
  });

  console.log("Transaction hash: ", hash);
  console.log("Waiting for confirmations");
  await publicClient.waitForTransactionReceipt({ hash });
  console.log(account.account.address, "Voting with ", amount, " to ", proposal);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
