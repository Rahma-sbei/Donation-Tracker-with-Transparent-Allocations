import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
//const RPC_URL = import.meta.env.VITE_RPC_URL;

const CONTRACT_ABI = [
  // write functions
  "function donate() payable",
  "function addCategory(string name)",
  "function spend(uint256 categoryId, uint256 amount, address recipient, string memo)",

  // read functiosn
  "function categoriesCount() view returns (uint256)",
  "function getCategory(uint256 id) view returns (tuple(uint256 id, string name))",
  //"function getCategory(uint256 id) view returns (uint256, string)",
  "function availableBalance() view returns (uint256)",
  "function spentByCategory(uint256 id) view returns (uint256)",

  // roles
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function ADMIN_ROLE() view returns (bytes32)",
  "function SPENDER_ROLE() view returns (bytes32)",

  // events
  "event CategoryAdded(uint256 id, string name)",
  "event DonationReceived(address indexed donor, uint256 amount)",
  //"event SpendExecuted(uint256 indexed categoryId, address indexed recipient, uint256 amount, string memo)",
  "event FundsSpent(uint256 indexed categoryId, address indexed recipient,uint256 amount,string memo)",
];

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  // console.log("CONTRACT:", CONTRACT_ADDRESS);
  const [account, setAccount] = useState(null);

  const [readContract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSpender, setIsSpender] = useState(false);

  const [loading, setLoading] = useState(false);

  const [balance, setBalance] = useState("0");
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  // initialize read only provider (for public transparency)
  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.JsonRpcProvider();

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider,
        );

        setReadContract(contract);

        await fetchData(contract);
      } catch (err) {
        console.error("Init error:", err);
      }
    };

    init();
  }, []);

  //initialize browser provider

  const connectWallet = async () => {
    console.log("CONNECT CLICKED");

    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    try {
      setLoading(true);

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);

      const network = await browserProvider.getNetwork();
      console.log("NETWORK:", network.chainId);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer,
      );

      // role check
      const adminRole = await contract.ADMIN_ROLE();
      const spenderRole = await contract.SPENDER_ROLE();
      const adminStatus = await contract.hasRole(adminRole, address);
      const spenderStatus = await contract.hasRole(spenderRole, address);

      setAccount(address);
      setWriteContract(contract);
      setIsAdmin(adminStatus);
      setIsSpender(spenderStatus);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch public data
  const fetchData = async (contract) => {
    try {
      // Balance
      const bal = await contract.availableBalance();
      setBalance(ethers.formatEther(bal));

      // Categories
      const count = await contract.categoriesCount();
      let cats = [];

      for (let i = 0; i < count; i++) {
        const c = await contract.getCategory(i);
        cats.push({
          id: Number(c.id),
          name: c.name,
        });
      }

      setCategories(cats);

      //Events
      const filter = contract.filters.FundsSpent();
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
      console.log("events in context", events);
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
        setIsSpender(false);
      } else {
        connectWallet();
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        readContract,
        writeContract,
        isAdmin,
        isSpender,
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
