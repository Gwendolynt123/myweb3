// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract SimpleContract {
    uint256 public value;
    address public owner;
    
    event ValueUpdated(uint256 newValue);
    
    constructor() {
        owner = msg.sender;
        value = 0;
    }
    
    function setValue(uint256 _newValue) public {
        require(msg.sender == owner, "Only owner can set value");
        value = _newValue;
        emit ValueUpdated(_newValue);
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}