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