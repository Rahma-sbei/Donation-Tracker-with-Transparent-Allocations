const hre = require("hardhat");

async function main() {
  const DonationTracker = await hre.ethers.getContractFactory(
    "DonationTracker",
  );

  const donationTracker = await DonationTracker.deploy();

  await donationTracker.waitForDeployment();

  const address = await donationTracker.getAddress();

  console.log("DonationTracker deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
