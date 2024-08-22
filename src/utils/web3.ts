import { ethers } from "ethers";
import { InjectedConnector } from "@web3-react/injected-connector";

const tokenSaleABI = [];

const tokenSaleAddress = "0x97be2234a7e64faada671370f55c3b063633c26c";

export const injected = new InjectedConnector({
  supportedChainIds: [97],
});

export async function getProvider() {
  const provider = new ethers.Web3Provider(window.ethereum as any);
  await provider.send("eth_requestAccounts", []);
  return provider;
}

export function getTokenSaleContract(provider: ethers.Web3Provider) {
  return new ethers.Contract(
    tokenSaleAddress,
    tokenSaleABI,
    provider.getSigner()
  );
}
