// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DonationTracker is AccessControl {
    //defining roles: Admin
    //admin can withdraw money
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Total ETH received
    uint256 public totalDonations;

    // List of allowed categories
    string[] public categoryNames;

    // Track how much was spent per category
    mapping(string => uint256) public categorySpent;

    // Track valid categories
    mapping(string => bool) public isValidCategory;

    event CategoryAdded(string name);
    event DonationReceived(address indexed donor, uint256 amount);
    event FundsSpent(string indexed category, uint256 amount, address indexed to);


    constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
    }

    // adding new category only callable by the admin
    function addCategory(string memory name) public onlyRole(ADMIN_ROLE)
    {
        require(!isValidCategory[name], "Category already exists");

        isValidCategory[name] = true;
        categoryNames.push(name);

        emit CategoryAdded(name);
    }

    //donate fucntion: callable by everyone
    function donate() public payable {
        require(msg.value > 0, "Donation must be > 0");

        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

    //spending funds from a specific category, only callable by admin
    function spend(string memory category, uint256 amount, address payable to) public onlyRole(ADMIN_ROLE)
    {
        require(isValidCategory[category], "Invalid category");
        require(address(this).balance >= amount, "Not enough ETH in contract");

        // Update spent before sending ETH to prevent reentrancy attacks
        categorySpent[category] += amount;

        // Transfer ETH
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH transfer failed");

        emit FundsSpent(category, amount, to);
    }

    //get category names
    function getCategoryNames() public view returns (string[] memory) {
        return categoryNames;
    }

    //get contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}