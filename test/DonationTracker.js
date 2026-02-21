const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationTracker", function () {
  let donationTracker;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const DonationTracker = await ethers.getContractFactory("DonationTracker");
    donationTracker = await DonationTracker.deploy();
    await donationTracker.waitForDeployment();
  });

  it("Admin can add a category", async function () {
    await donationTracker.addCategory("Marketing");

    expect(await donationTracker.isValidCategory("Marketing")).to.equal(true);
  });

  it("Non-admin cannot add a category", async function () {
    await expect(donationTracker.connect(user).addCategory("Ops")).to.be
      .reverted;
  });
});
