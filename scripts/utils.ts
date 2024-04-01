import { http, createPublicClient, PublicClient, createWalletClient } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY;
const deployerPrivateKey = process.env.PRIVATE_KEY;

type Provider = 'Alchemy' | 'Infura' | 'Etherscan'

export const getPublicClient = (clientProvider: Provider): PublicClient => {
  if (!providerApiKey) {
    throw new Error('Provider API key not found');
  }

  switch(clientProvider) {
    case 'Alchemy': {
      return createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`)
      });
    }
    default: {
      throw new Error(`Client provider ${clientProvider} not supported`);
    }
  }
}

export const getAccountClient = () => {
  if (!deployerPrivateKey) {
    throw new Error('Deployer private key not found');
  }

  const account = privateKeyToAccount(`0x${deployerPrivateKey}`)
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`)
  });
  console.log("Account address: ", walletClient.account.address);

  return walletClient;
}
export const getContractAddress = (parameter: string): `0x${string}` => {
  const contractAddress = parameter as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  return contractAddress;
};