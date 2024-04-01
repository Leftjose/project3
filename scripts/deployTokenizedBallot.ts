import { toHex } from "viem";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { getPublicClient, getAccountClient } from "./utils";

async function main() {
  const proposals = process.argv.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");

  const publicClient = getPublicClient("Alchemy");
  const deployer = getAccountClient();

  const myTokenAddress = '0x5797F142E7529f776263dE121d875d39d21507a4' as `0x${string}`;

  console.log("Deploying TokenizedBallot contract");
  const blockNumber = await publicClient.getBlockNumber();
  const tokenizedBallotHash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [
      proposals.map((prop) => toHex(prop, { size: 32 })),
      myTokenAddress, 
      blockNumber,
    ],
  });

  const receiptTokenizedBallot = await publicClient.waitForTransactionReceipt({ hash: tokenizedBallotHash });
  console.log("TokenizedBallot deployed at: ", receiptTokenizedBallot.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
