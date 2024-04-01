import { formatEther, toHex } from "viem";
import { abi as abiMyToken, bytecode as bytecodeMyToken } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { abi as abiTokenizedBallot, bytecode as bytecodeTokenizedBallot } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { getPublicClient, getAccountClient } from "./utils";

async function main() {
  const proposals = process.argv.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");

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
    abi: abiMyToken,
    bytecode: bytecodeMyToken as `0x${string}`,
    args: [],
  });

  console.log("Transaction hash: ", hash);
  console.log("Waiting for confirmations");

  
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("My token Contract deployed at: ", receipt.contractAddress);

  const blockNumber = await publicClient.getBlockNumber();
  const tokenizedBallotHash = await deployer.deployContract({
    abi: abiTokenizedBallot,
    bytecode: bytecodeTokenizedBallot as `0x${string}`,
    args: [
      proposals.map((prop) => toHex(prop, { size: 32 })),
      receipt.contractAddress, 
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
