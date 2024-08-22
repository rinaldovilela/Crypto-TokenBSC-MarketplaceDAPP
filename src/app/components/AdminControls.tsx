// components/AdminControls.tsx
import React, { useState } from "react";
import { useWeb3 } from "../../contexts/Web3Context";
import { ethers } from "ethers";

const AdminControls: React.FC = () => {
  const { tokenSaleContract } = useWeb3();
  const [newFixedPrice, setNewFixedPrice] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [increment, setIncrement] = useState<string>("");

  const handleSetFixedPrice = async () => {
    if (tokenSaleContract) {
      try {
        const priceInWei = ethers.parseEther(newFixedPrice);
        const tx = await tokenSaleContract.setFixedPrice(priceInWei);
        await tx.wait();
        alert("Preço fixo atualizado com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao atualizar preço fixo.");
      }
    }
  };

  const handleSetDynamicPricing = async () => {
    if (tokenSaleContract) {
      try {
        const basePriceInWei = ethers.parseEther(basePrice);
        const incrementInWei = ethers.parseEther(increment);
        const tx = await tokenSaleContract.setDynamicPricing(
          basePriceInWei,
          incrementInWei
        );
        await tx.wait();
        alert("Preços dinâmicos atualizados com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao atualizar preços dinâmicos.");
      }
    }
  };

  return (
    <div>
      <h2>Admin Controls</h2>
      <div>
        <input
          type="text"
          placeholder="Novo preço fixo (ETH)"
          value={newFixedPrice}
          onChange={(e) => setNewFixedPrice(e.target.value)}
        />
        <button onClick={handleSetFixedPrice}>Definir Preço Fixo</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Preço base dinâmico (ETH)"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Incremento dinâmico (ETH)"
          value={increment}
          onChange={(e) => setIncrement(e.target.value)}
        />
        <button onClick={handleSetDynamicPricing}>
          Definir Preços Dinâmicos
        </button>
      </div>
    </div>
  );
};

export default AdminControls;
