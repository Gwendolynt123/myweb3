const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Lock", function () {
  let lock;
  let owner;
  let otherAccount;
  let unlockTime;
  const lockedAmount = ethers.parseEther("1");

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    
    // 设置解锁时间为1年后
    unlockTime = (await time.latest()) + (365 * 24 * 60 * 60);
    
    const Lock = await ethers.getContractFactory("Lock");
    lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  });

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      expect(await ethers.provider.getBalance(lock.target)).to.equal(lockedAmount);
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      
      await expect(
        Lock.deploy(latestTime, { value: 1 })
      ).to.be.revertedWith("Unlock time should be in the future");
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
      });

      it("Should revert with the right error if called from another account", async function () {
        // 将时间快进到解锁时间
        await time.increaseTo(unlockTime);

        // 尝试从其他账户提取
        await expect(
          lock.connect(otherAccount).withdraw()
        ).to.be.revertedWith("You aren't the owner");
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        await time.increaseTo(unlockTime);

        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, unlockTime);
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        await time.increaseTo(unlockTime);

        const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
        
        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});