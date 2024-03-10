// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract SimpleContract {
    uint256 public value;
    address public owner;
    
    event ValueUpdated(uint256 newValue);
    event ValueIncremented(uint256 newValue);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event ValueDecremented(uint256 newValue);
    event ValueReset(uint256 previousValue);
    
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
    
    function incrementValue() public {
        require(msg.sender == owner, "Only owner can increment value");
        value += 1;
        emit ValueIncremented(value);
    }
    
    function transferOwnership(address newOwner) public {
        require(msg.sender == owner, "Only owner can transfer ownership");
        require(newOwner != address(0), "New owner cannot be zero address");
        
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
    
    function decrementValue() public {
        require(msg.sender == owner, "Only owner can decrement value");
        require(value > 0, "Value cannot be decremented below zero");
        value -= 1;
        emit ValueDecremented(value);
    }
    
    function resetValue() public {
        require(msg.sender == owner, "Only owner can reset value");
        uint256 previousValue = value;
        value = 0;
        emit ValueReset(previousValue);
    }
}