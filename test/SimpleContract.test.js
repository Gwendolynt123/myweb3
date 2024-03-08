const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleContract", function () {
  let simpleContract;
  let owner;
  let otherAccount;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    
    const SimpleContract = await ethers.getContractFactory("SimpleContract");
    simpleContract = await SimpleContract.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await simpleContract.owner()).to.equal(owner.address);
    });

    it("Should initialize value to 0", async function () {
      expect(await simpleContract.value()).to.equal(0);
      expect(await simpleContract.getValue()).to.equal(0);
    });
  });

  describe("Set Value", function () {
    it("Should allow owner to set value", async function () {
      const newValue = 42;
      
      await expect(simpleContract.setValue(newValue))
        .to.emit(simpleContract, "ValueUpdated")
        .withArgs(newValue);
      
      expect(await simpleContract.getValue()).to.equal(newValue);
      expect(await simpleContract.value()).to.equal(newValue);
    });

    it("Should not allow non-owner to set value", async function () {
      await expect(
        simpleContract.connect(otherAccount).setValue(100)
      ).to.be.revertedWith("Only owner can set value");
    });

    it("Should update value multiple times", async function () {
      await simpleContract.setValue(10);
      expect(await simpleContract.getValue()).to.equal(10);

      await simpleContract.setValue(20);
      expect(await simpleContract.getValue()).to.equal(20);

      await simpleContract.setValue(0);
      expect(await simpleContract.getValue()).to.equal(0);
    });
  });

  describe("Events", function () {
    it("Should emit ValueUpdated event with correct parameters", async function () {
      const newValue = 123;
      
      await expect(simpleContract.setValue(newValue))
        .to.emit(simpleContract, "ValueUpdated")
        .withArgs(newValue);
    });
  });

  describe("Increment Value", function () {
    it("Should allow owner to increment value", async function () {
      await simpleContract.setValue(10);
      
      await expect(simpleContract.incrementValue())
        .to.emit(simpleContract, "ValueIncremented")
        .withArgs(11);
      
      expect(await simpleContract.getValue()).to.equal(11);
    });

    it("Should not allow non-owner to increment value", async function () {
      await expect(
        simpleContract.connect(otherAccount).incrementValue()
      ).to.be.revertedWith("Only owner can increment value");
    });

    it("Should increment value multiple times", async function () {
      expect(await simpleContract.getValue()).to.equal(0);

      await simpleContract.incrementValue();
      expect(await simpleContract.getValue()).to.equal(1);

      await simpleContract.incrementValue();
      expect(await simpleContract.getValue()).to.equal(2);

      await simpleContract.incrementValue();
      expect(await simpleContract.getValue()).to.equal(3);
    });
  });

  describe("Transfer Ownership", function () {
    it("Should allow owner to transfer ownership", async function () {
      await expect(simpleContract.transferOwnership(otherAccount.address))
        .to.emit(simpleContract, "OwnershipTransferred")
        .withArgs(owner.address, otherAccount.address);
      
      expect(await simpleContract.owner()).to.equal(otherAccount.address);
    });

    it("Should not allow non-owner to transfer ownership", async function () {
      await expect(
        simpleContract.connect(otherAccount).transferOwnership(otherAccount.address)
      ).to.be.revertedWith("Only owner can transfer ownership");
    });

    it("Should not allow transfer to zero address", async function () {
      await expect(
        simpleContract.transferOwnership("0x0000000000000000000000000000000000000000")
      ).to.be.revertedWith("New owner cannot be zero address");
    });

    it("Should update owner privileges after transfer", async function () {
      // Transfer ownership
      await simpleContract.transferOwnership(otherAccount.address);
      
      // Original owner should not be able to set value
      await expect(
        simpleContract.setValue(100)
      ).to.be.revertedWith("Only owner can set value");
      
      // New owner should be able to set value
      await expect(simpleContract.connect(otherAccount).setValue(100))
        .to.emit(simpleContract, "ValueUpdated")
        .withArgs(100);
      
      expect(await simpleContract.getValue()).to.equal(100);
    });
  });

  describe("View Functions", function () {
    it("Should return correct value via getValue function", async function () {
      await simpleContract.setValue(999);
      expect(await simpleContract.getValue()).to.equal(999);
    });

    it("Should return correct owner", async function () {
      expect(await simpleContract.owner()).to.equal(owner.address);
    });
  });
});