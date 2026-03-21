# ClearFund-Donation Tracker with Transparent Allocations

![banner](https://user-images.githubusercontent.com/Rahma-sbei/banner-placeholder.png)

A **Web3-powered donation tracker** that allows organizations to receive donations in ETH and spend funds only in **pre-approved categories**, with full transparency + role-based access using blockchain technology.

<p align="center">
  <img src="https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white" />
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenZeppelin-4E5EE4?style=for-the-badge&logo=openzeppelin&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Ethers.js-3C3C3D?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MetaMask-F6851B?style=for-the-badge&logo=metamask&logoColor=white" />
  <img src="https://img.shields.io/badge/Hardhat-F7DF1E?style=for-the-badge" />
</p>

---

## Project Description 📋

This project is a **transparent fund management dApp** built on Ethereum. Donors can send ETH to the smart contract, and admins can allocate funds to predefined categories. Every transaction is recorded on the blockchain, ensuring **complete transparency**.

It’s perfect for:

- Non-profits and charities
- Transparent crowdfunding campaigns
- Projects that need **trustworthy tracking of funds**

---

## Features ✨

- 💰 **Donations in ETH** – anyone can donate.
- 🗝 **Admin-controlled spending** – only admins can withdraw funds to specific categories.
- 📝 **Category management** – only admins can add spending categories.
- 🔍 **Transparency dashboard** – track donations and spending in real-time.
- 🔗 **Web3 integration** – connect via MetaMask to interact with the smart contract.
- 🪛 **Local blockchain testing** – local Hardhat environment for testing.

---

## Project Setup 🛠

The oroject can be set up locally following these steps:

**1. Clone the repo**

```bash
git clone https://github.com/yourusername/donation-tracker.git
cd donation-tracker
```

**2. Install Dependencies**

```
# Root folder for Hardhat
npm install

# Frontend
cd frontend
npm install
```

**3. Start local Hardhat Blockcain**

```
npx hardhat node
```

**4. Connect to Metatask and run**

4.1. Add MetaTask network

    -Network Name: Hardhat Local

    -RPC URL: http://127.0.0.1:<your_port>

    -Chain ID: 31337

    -Currency Symbol: ETH

4.2 Deploy smart contract and Run

```
npx hardhat run scripts/deploy.js --network localhost

```

```
cd frontend
npm run dev
```

## Testing 🔧

```
npx hardhat test
```

**Tests Include**

- User can donate ETH
- Admin can add categories
- Admin can spend ETH
- Non-admins cannot perform restricted actions
