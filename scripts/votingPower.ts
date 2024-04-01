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

  console.log('**************', {
    delegateAddress,
    contractAddress,
  })
  const data = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getVotes",
    args: [delegateAddress],
  })

  console.log("Votes: ", data);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//npm run contract:delegate 0xcc003CE7C1a5A5FCD3B54617eDb508CC45DEA499 0x4b115f6a5face16d602d7870c89263d71cccd2de