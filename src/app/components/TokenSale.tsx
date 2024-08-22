// components/TokenSale.tsx
import React, { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { ethers } from "ethers";

const TokenSale: React.FC = () => {
  const { provider, tokenSaleContract, connect } = useWeb3();
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<string>("0");

  const handleBuyTokens = async () => {
    if (tokenSaleContract && provider) {
      try {
        const cost = ethers.parseEther((amount * parseFloat(price)).toString());
        const tx = await tokenSaleContract.buyTokens(amount, { value: cost });
        await tx.wait();
        alert("Tokens comprados com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao comprar tokens.");
      }
    }
  };

  const fetchPrice = async () => {
    if (tokenSaleContract) {
      try {
        const currentPrice = await tokenSaleContract.getCurrentPrice(1);
        setPrice(ethers.formatEther(currentPrice));
      } catch (error) {
        console.error(error);
        alert("Erro ao buscar preço.");
      }
    }
  };

  return (
    <div>
      <button onClick={connect}>Conectar Carteira</button>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={fetchPrice}>Buscar Preço Atual</button>
        <p>Preço Atual: {price} ETH</p>
        <button onClick={handleBuyTokens}>Comprar Tokens</button>
      </div>
    </div>
  );
};

export default TokenSale;
