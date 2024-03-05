const hre = require("hardhat");

async function main() {
  console.log("Deploying SimpleContract...");

  // 部署合约
  const SimpleContract = await hre.ethers.getContractFactory("SimpleContract");
  const simpleContract = await SimpleContract.deploy();

  await simpleContract.waitForDeployment();

  const contractAddress = await simpleContract.getAddress();
  console.log("SimpleContract deployed to:", contractAddress);
  console.log("Contract owner:", await simpleContract.owner());
  console.log("Initial value:", await simpleContract.getValue());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});