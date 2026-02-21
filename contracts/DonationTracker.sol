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

    function addCategory(string memory name) public onlyRole(ADMIN_ROLE)
    {
        require(!isValidCategory[name], "Category already exists");

        isValidCategory[name] = true;
        categoryNames.push(name);

        emit CategoryAdded(name);
    }
}