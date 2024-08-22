import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  getProvider,
  getTokenSaleContract,
  getTokenBalance,
} from "../../utils/web3";

const tokenSaleAddress = "0xAFFc4bE31CEAA7f40448BADEefD528D428034724";
const tokenAddress = "0x97be2234a7e64faada671370f55c3b063633c26c";

export function TokenSale() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [tokenSaleContract, setTokenSaleContract] =
    useState<ethers.Contract | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);
  const [contractTokenBalance, setContractTokenBalance] = useState<string>("0");

  useEffect(() => {
    const init = async () => {
      try {
        const prov = await getProvider();
        setProvider(prov);
        const contract = await getTokenSaleContract(prov);
        setTokenSaleContract(contract);

        // Fetch current price
        const currentPrice = await contract.getCurrentPrice();
        setPrice(ethers.formatUnits(currentPrice, "ether"));

        // Fetch token balance
        const balance = await getTokenBalance(
          tokenSaleAddress,
          tokenAddress,
          prov
        );
        setContractTokenBalance(balance);
      } catch (err) {
        console.error("Error initializing the contract:", err);
        setError("Error initializing the contract");
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (amount > 0 && price) {
      try {
        const priceInEther = parseFloat(price);
        const cost = ethers.parseUnits(
          (amount * priceInEther).toFixed(18),
          "ether"
        );
        setTotalCost(ethers.formatUnits(cost, "ether"));
      } catch (err) {
        console.error("Error calculating total cost:", err);
        setTotalCost("0");
      }
    } else {
      setTotalCost("0");
    }
  }, [amount, price]);

  const handleBuyTokens = async () => {
    if (provider && tokenSaleContract && amount > 0 && totalCost) {
      try {
        const tx = await tokenSaleContract.buyTokens(
          ethers.parseUnits(amount.toString(), "wei"),
          {
            value: ethers.parseUnits(totalCost, "ether"),
          }
        );
        await tx.wait();
        console.log("Tokens purchased successfully!");
      } catch (err) {
        console.error("Error purchasing tokens:", err);
        setError("Error purchasing tokens");
      }
    } else {
      console.error("Provider, contract or amount is missing");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Token Sale
        </h1>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount of Tokens
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter amount"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-800">
            Price: {price ? `${price} ETH` : "Fetching..."}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Total Cost: {totalCost} ETH
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Contract Token Balance: {contractTokenBalance} Tokens
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleBuyTokens}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Buy Tokens
          </button>
        </div>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}
