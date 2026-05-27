const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SharpKitModule", (m) => {
  // treasury = deployer — receives initial 10,000,000 SHRP supply
  const treasury = m.getAccount(0);

  const sharpToken = m.contract("SharpToken", [treasury]);

  return { sharpToken };
});
