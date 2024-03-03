const hre = require("hardhat");

async function main() {
  // 获取当前时间戳并添加1年（365天）
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = Math.floor(Date.now() / 1000) + ONE_YEAR_IN_SECS;
  
  // 设置要锁定的ETH数量（0.01 ETH）
  const lockedAmount = hre.ethers.parseEther("0.01");

  console.log("Deploying Lock contract...");
  console.log("Unlock time:", new Date(unlockTime * 1000).toLocaleString());
  console.log("Locked amount:", hre.ethers.formatEther(lockedAmount), "ETH");

  // 部署合约
  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.waitForDeployment();

  const contractAddress = await lock.getAddress();
  console.log("Lock contract deployed to:", contractAddress);
  console.log("Contract owner:", await lock.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});