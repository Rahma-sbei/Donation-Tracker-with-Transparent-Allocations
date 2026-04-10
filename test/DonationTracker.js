const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationTracker", function () {
  let donationTracker;
  let owner; // admin
  let user; // regular donor
  let spender; // spender role

  beforeEach(async function () {
    [owner, user, spender] = await ethers.getSigners();

    const DonationTracker = await ethers.getContractFactory("DonationTracker");
    donationTracker = await DonationTracker.deploy();

    await donationTracker.waitForDeployment();

    // Grant SPENDER_ROLE to a separate account
    const SPENDER_ROLE = await donationTracker.SPENDER_ROLE();
    await donationTracker.grantRole(SPENDER_ROLE, spender.address);
  });

  // ROLE TESTS

  it("Owner has ADMIN and SPENDER roles", async function () {
    const ADMIN_ROLE = await donationTracker.ADMIN_ROLE();
    const SPENDER_ROLE = await donationTracker.SPENDER_ROLE();

    expect(await donationTracker.hasRole(ADMIN_ROLE, owner.address)).to.equal(
      true,
    );
    expect(await donationTracker.hasRole(SPENDER_ROLE, owner.address)).to.equal(
      true,
    );
  });

  it("Spender account has only SPENDER_ROLE", async function () {
    const ADMIN_ROLE = await donationTracker.ADMIN_ROLE();
    const SPENDER_ROLE = await donationTracker.SPENDER_ROLE();

    expect(
      await donationTracker.hasRole(SPENDER_ROLE, spender.address),
    ).to.equal(true);
    expect(await donationTracker.hasRole(ADMIN_ROLE, spender.address)).to.equal(
      false,
    );
  });

  //add category tst

  it("Admin can add category", async function () {
    await donationTracker.addCategory("Marketing");

    expect(await donationTracker.isValidCategory(0)).to.equal(true);

    const category = await donationTracker.getCategory(0);
    expect(category.name).to.equal("Marketing");
  });

  it("Non-admin cannot add category", async function () {
    await expect(donationTracker.connect(user).addCategory("Ops")).to.be
      .reverted;
  });

  //donating tst

  it("Any user can donate ETH", async function () {
    await donationTracker.connect(user).donate({
      value: ethers.parseEther("1"),
    });

    expect(await donationTracker.totalDonations()).to.equal(
      ethers.parseEther("1"),
    );
  });

  // spending tst

  it("Spender can spend funds", async function () {
    await donationTracker.addCategory("Marketing");

    await donationTracker.connect(user).donate({
      value: ethers.parseEther("1"),
    });

    await donationTracker
      .connect(spender)
      .spend(0, ethers.parseEther("0.5"), owner.address, "Marketing campaign");

    expect(await donationTracker.spentByCategory(0)).to.equal(
      ethers.parseEther("0.5"),
    );
  });

  it("Non-spender cannot spend funds", async function () {
    await donationTracker.addCategory("Marketing");

    await donationTracker.connect(user).donate({
      value: ethers.parseEther("1"),
    });

    await expect(
      donationTracker
        .connect(user)
        .spend(0, ethers.parseEther("0.5"), owner.address, "Invalid attempt"),
    ).to.be.reverted;
  });

  // workflow tst

  it("Full workflow: admin adds category, user donates, spender spends", async function () {
    // 1. Admin creates category
    await donationTracker.addCategory("Operations");

    // 2. User donates
    await donationTracker.connect(user).donate({
      value: ethers.parseEther("2"),
    });

    // 3. Spender executes spending
    await donationTracker
      .connect(spender)
      .spend(0, ethers.parseEther("1"), owner.address, "Ops budget allocation");

    // 4. Validate results
    expect(await donationTracker.spentByCategory(0)).to.equal(
      ethers.parseEther("1"),
    );

    expect(await donationTracker.availableBalance()).to.equal(
      ethers.parseEther("1"),
    );
  });
});
