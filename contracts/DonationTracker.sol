// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DonationTracker is AccessControl {
    // We will write the logic here in the next step
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}