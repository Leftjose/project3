import { getPublicClient, getAccountClient } from "./utils";
import { abi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { hexToString } from "viem";

const getParameters = () => {
  const parameters = process.argv.slice(2);
  const contractAddress = parameters[0] as `0x${string}`;

  return {
    contractAddress,
    publicClient: getPublicClient("Alchemy")
  };
}

async function main() {
  const { contractAddress, publicClient } = getParameters();

  const winnerHex = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winnerName",
  });

  const winner = hexToString(winnerHex  as `0x${string}`);
  console.log("Winner:", winner);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});