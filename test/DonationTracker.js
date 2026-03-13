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

  it("Non-admin cannot add category", async function () {
    await expect(donationTracker.connect(user).addCategory("Ops")).to.be
      .reverted;
  });

  it("User can donate ETH", async function () {
    await donationTracker.connect(user).donate({
      value: ethers.parseEther("1"),
    });

    expect(await donationTracker.totalDonations()).to.equal(
      ethers.parseEther("1"),
    );
  });

  it("Admin can spend funds", async function () {
    await donationTracker.addCategory("Marketing");

    await donationTracker.connect(user).donate({
      value: ethers.parseEther("1"),
    });

    await donationTracker.spend(
      "Marketing",
      ethers.parseEther("0.5"),
      owner.address,
    );

    expect(await donationTracker.categorySpent("Marketing")).to.equal(
      ethers.parseEther("0.5"),
    );
  });
});
