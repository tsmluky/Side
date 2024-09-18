const { ethers } = require("hardhat");
const { AaveFlashloan } = require("@aave/core-v3");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    // Solicitar flash loan
    const loanAmount = ethers.utils.parseUnits("1000", 18); // 1000 USDC por ejemplo
    const flashloanContract = await ethers.getContractAt("AaveFlashloan", deployer.address);
    await flashloanContract.requestFlashloan(loanAmount);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
