// components/TokenSale.tsx
import React, { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { ethers } from "ethers";

const TokenSale: React.FC = () => {
  const { provider, tokenSaleContract, connect } = useWeb3();
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<string>("0");
  const [totalCost, setTotalCost] = useState<string>("0");

  useEffect(() => {
    if (amount > 0 && price) {
      try {
        // Converte o preço para BigNumber usando a unidade de ether
        const priceBN = ethers.parseUnits(price, "ether");
        // Calcula o custo total usando BigNumber
        const costBN = priceBN.mul(amount);
        // Formata o custo total de volta para ether como string
        setTotalCost(ethers.formatUnits(costBN, "ether"));
      } catch (error) {
        console.error("Error calculating total cost:", error);
        setTotalCost("0");
      }
    } else {
      setTotalCost("0");
    }
  }, [amount, price]);

  const handleBuyTokens = async () => {
    if (tokenSaleContract && provider) {
      try {
        // Converte o preço para BigNumber usando a unidade de ether
        const priceBN = ethers.parseUnits(price, "ether");
        // Calcula o custo total usando BigNumber
        const costBN = priceBN.mul(amount);
        // Envia a transação para comprar tokens
        const tx = await tokenSaleContract.buyTokens(amount, { value: costBN });
        await tx.wait();
        alert("Tokens comprados com sucesso!");
      } catch (error) {
        console.error("Error buying tokens:", error);
        alert("Erro ao comprar tokens.");
      }
    }
  };

  const fetchPrice = async () => {
    if (tokenSaleContract) {
      try {
        const currentPrice = await tokenSaleContract.getCurrentPrice();
        // Formata o preço para ether como string
        setPrice(ethers.formatUnits(currentPrice, "ether"));
      } catch (error) {
        console.error("Error fetching price: ", error);
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
          placeholder="Quantidade de Tokens"
        />
        <button onClick={fetchPrice}>Buscar Preço Atual</button>
        <p>Preço Atual: {price} ETH por token</p>
        <p>Custo Total: {totalCost} ETH</p>
        <button onClick={handleBuyTokens}>Comprar Tokens</button>
      </div>
    </div>
  );
};

export default TokenSale;
