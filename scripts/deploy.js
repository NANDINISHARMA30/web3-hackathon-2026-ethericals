const { ethers, network, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Network:", network.name);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  const SharpToken = await ethers.getContractFactory("SharpToken");
  console.log("Deploying SharpToken...");

  const feeData = await ethers.provider.getFeeData();
  const token = await SharpToken.deploy(deployer.address, {
    gasLimit: 3_000_000,
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
  });

  console.log("Tx hash:", token.deploymentTransaction().hash);
  console.log("Waiting for confirmation...");
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("SharpToken deployed to:", address);

  const deployment = {
    network: network.name,
    SharpToken: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, `../deployments.${network.name}.json`),
    JSON.stringify(deployment, null, 2)
  );

  const artifact = await artifacts.readArtifact("SharpToken");
  fs.writeFileSync(
    path.join(__dirname, "../frontend/SharpToken.json"),
    JSON.stringify({ abi: artifact.abi, address }, null, 2)
  );

  console.log("Done. Update .env: SHARP_TOKEN_ADDRESS=" + address);
}

main().catch((e) => { console.error(e); process.exit(1); });
