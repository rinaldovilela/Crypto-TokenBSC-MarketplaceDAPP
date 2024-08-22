"use client";
import { Web3Provider } from "@/contexts/Web3Context";
import TokenSale from "./components/TokenSale";
import AdminControls from "./components/AdminControls";

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
