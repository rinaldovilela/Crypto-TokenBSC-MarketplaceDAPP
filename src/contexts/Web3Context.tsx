// context/Web3Context.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { getProvider, getTokenSaleContract } from "../utils/web3";

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  tokenSaleContract: ethers.Contract | null;
  connect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [tokenSaleContract, setTokenSaleContract] =
    useState<ethers.Contract | null>(null);

  useEffect(() => {
    async function initialize() {
      const provider = await getProvider();
      setProvider(provider);
      setTokenSaleContract(await getTokenSaleContract(provider));
    }
    initialize();
  }, []);

  const connect = async () => {
    const provider = await getProvider();
    setProvider(provider);
    setTokenSaleContract(await getTokenSaleContract(provider));
  };

  return (
    <Web3Context.Provider value={{ provider, tokenSaleContract, connect }}>
      {children}
    </Web3Context.Provider>
  );
};

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
