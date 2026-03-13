import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  "function donate() payable",
  "function addCategory(string name)",
  "function spend(string category, uint256 amount, address to)",

  "function getCategoryNames() view returns (string[])",
  "function getBalance() view returns (uint256)",

  "function totalDonations() view returns (uint256)",
  "function categorySpent(string) view returns (uint256)",
  "function isValidCategory(string) view returns (bool)",

  "function hasRole(bytes32 role, address account) view returns (bool)",

  "event CategoryAdded(string name)",
  "event DonationReceived(address indexed donor, uint256 amount)",
  "event FundsSpent(string indexed category, uint256 amount, address indexed to)",
];

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [balance, setBalance] = useState("0");
  const [events, setEvents] = useState([]);

  // Connects to MetaMask and initializes the Ethers.js instances
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);

        // Ethers v6 syntax for connecting to MetaMask
        const browserProvider = new ethers.BrowserProvider(window.ethereum);

        // Request account access
        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();

        // Connect to our smart contract
        const appContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer,
        );

        // OpenZeppelin's DEFAULT_ADMIN_ROLE is exactly 32 bytes of zeros
        const adminRole = ethers.ZeroHash;
        const adminStatus = await appContract.hasRole(adminRole, address);

        // Update Global State
        setProvider(browserProvider);
        setContract(appContract);
        setAccount(address);
        setIsAdmin(adminStatus);

        // Fetch initial dashboard data
        await fetchData(appContract, browserProvider);
      } catch (error) {
        console.error("Connection error:", error);
        alert("Failed to connect wallet.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please install MetaMask to use this application!");
    }
  };

  // Fetches the contract balance and past events for the Transparency Dashboard
  const fetchData = async (appContract, appProvider) => {
    try {
      // 1. Fetch Total Balance
      const bal = await appProvider.getBalance(CONTRACT_ADDRESS);
      setBalance(ethers.formatEther(bal));

      // 2. Fetch Spending Events (The "Transparency" feature)
      const spendFilter = appContract.filters.FundsSpent();
      const spendEvents = await appContract.queryFilter(spendFilter);

      // Map the raw blockchain data into a clean JavaScript array
      const formattedEvents = spendEvents
        .map((event) => ({
          category: event.args[0],
          amount: ethers.formatEther(event.args[1]), // Convert Wei to ETH
          destination: event.args[2],
          hash: event.transactionHash,
        }))
        .reverse(); // .reverse() puts the newest events at the top of our UI

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
    }
  };

  // --- Optional (but highly recommended): Listen for account changes ---
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          // If they switch accounts in MetaMask, reconnect automatically
          connectWallet();
        } else {
          // If they disconnect totally, clear the state
          setAccount(null);
          setContract(null);
          setIsAdmin(false);
        }
      });
    }
    // Cleanup listener on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  });
  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        contract,
        isAdmin,
        loading,
        balance,
        events,
        connectWallet,
        fetchData,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
