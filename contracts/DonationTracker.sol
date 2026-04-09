// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DonationTracker is AccessControl {
    //defining roles: Admin
    //admin can manage categories
    //spender can spend money
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SPENDER_ROLE = keccak256("SPENDER_ROLE");

    // Total ETH received
    uint256 public totalDonations;

    //define category struct
     struct Category {
        uint256 id;
        string name;
    }

    // List of allowed categories
    Category[] private categories;

    // Track how much was spent per category
    mapping(uint256 => uint256) private categorySpent;

    // Track valid categories
    mapping(uint256 => bool) public isValidCategory;



    event CategoryAdded(uint256 id, string name);
    event DonationReceived(address indexed donor, uint256 amount);
    event FundsSpent(
        uint256 indexed categoryId,
        address indexed recipient,
        uint256 amount,
        string memo
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(SPENDER_ROLE, msg.sender);
    }

    //category managment fucntions

    // adding new category only callable by the admin
    function addCategory(string memory name) public onlyRole(ADMIN_ROLE) {
        uint256 id = categories.length;

        categories.push(Category(id, name));
        isValidCategory[id] = true;

        emit CategoryAdded(id, name);
    }

    function categoriesCount() public view returns (uint256) {
        return categories.length;
    }

    function getCategory(uint256 id) public view returns (Category memory) {
        require(isValidCategory[id], "Invalid category");
        return categories[id];
    }


    //donate fucntion: callable by everyone
    function donate() public payable {
        require(msg.value > 0, "Donation must be > 0");

        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

//spending funds

    function spend(
        uint256 categoryId,
        uint256 amount,
        address payable recipient,
        string calldata memo
    ) public onlyRole(SPENDER_ROLE) {

        require(isValidCategory[categoryId], "Invalid category");
        require(address(this).balance >= amount, "Insufficient balance");

        categorySpent[categoryId] += amount;

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsSpent(categoryId, recipient, amount, memo);
    }

    function spentByCategory(uint256 id) public view returns (uint256) {
        return categorySpent[id];
    }

    function availableBalance() public view returns (uint256) {
        return address(this).balance;
    }
}