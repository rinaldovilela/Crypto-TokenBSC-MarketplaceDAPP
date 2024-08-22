"use client";
import { Web3Provider } from "@/contexts/Web3Context";
import AdminControls from "./components/AdminControls";
import { TokenSale } from "./components/TokenSale";

export default function Home() {
  return (
    <Web3Provider>
      <div>
        <h1>Token Sale Dapp</h1>
        <TokenSale />
        <AdminControls />
      </div>
    </Web3Provider>
  );
}
