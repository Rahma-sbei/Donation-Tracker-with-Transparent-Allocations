import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;

const CONTRACT_ABI = [
  // write functions
  "function donate() payable",
  "function addCategory(string name)",
  "function spend(uint256 categoryId, uint256 amount, address recipient, string memo)",

  // read functiosn
  "function categoriesCount() view returns (uint256)",
  "function getCategory(uint256 id) view returns (tuple(uint256 id, string name))",
  "function availableBalance() view returns (uint256)",
  "function spentByCategory(uint256 id) view returns (uint256)",

  // roles
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function ADMIN_ROLE() view returns (bytes32)",
  "function SPENDER_ROLE() view returns (bytes32)",

  // events
  "event CategoryAdded(uint256 id, string name)",
  "event DonationReceived(address indexed donor, uint256 amount)",
  "event SpendExecuted(uint256 indexed categoryId, address indexed recipient, uint256 amount, string memo)",
];

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);

  // const [readProvider, setReadProvider] = useState(null);
  // const [writeProvider, setWriteProvider] = useState(null);

  const [readContract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [balance, setBalance] = useState("0");
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  // initialize read only provider (for public transparency)
  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider,
        );

        setReadContract(contract);

        await fetchData(contract, provider);
      } catch (err) {
        console.error("Init error:", err);
      }
    };

    init();
  }, []);

  //initialize browser provider

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setLoading(true);

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);

      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer,
      );

      // role check
      const adminRole = await contract.ADMIN_ROLE();
      const adminStatus = await contract.hasRole(adminRole, address);

      setAccount(address);
      setWriteContract(contract);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch public data
  const fetchData = async (contract, provider) => {
    try {
      // Balance
      const bal = await provider.getBalance(CONTRACT_ADDRESS);
      setBalance(ethers.formatEther(bal));

      // Categories
      const count = await contract.categoriesCount();
      let cats = [];

      for (let i = 0; i < count; i++) {
        const c = await contract.getCategory(i);
        cats.push(c);
      }

      setCategories(cats);

      // Events
      const filter = contract.filters.SpendExecuted();
      const logs = await contract.queryFilter(filter);

      const formatted = logs
        .map((event) => ({
          categoryId: event.args[0],
          recipient: event.args[1],
          amount: ethers.formatEther(event.args[2]),
          memo: event.args[3],
          hash: event.transactionHash,
        }))
        .reverse();

      setEvents(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // account listener
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setWriteContract(null);
        setIsAdmin(false);
      } else {
        connectWallet();
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const contract = writeContract || readContract;

  return (
    <Web3Context.Provider
      value={{
        account,
        contract,
        readContract,
        writeContract,
        isAdmin,
        loading,
        balance,
        events,
        categories,
        connectWallet,
        fetchData,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
