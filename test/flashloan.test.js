const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Flashloan", function () {
  let flashloan, provider, owner, addr1, addr2;

  beforeEach(async function () {
    // Desplegar el contrato
    [owner, addr1, addr2] = await ethers.getSigners();

    // Desplegamos un mock del PoolAddressesProvider
    const PoolAddressesProvider = await ethers.getContractFactory("PoolAddressesProvider");
    provider = await PoolAddressesProvider.deploy();
    await provider.deployed();

    // Desplegamos el contrato Flashloan
    const Flashloan = await ethers.getContractFactory("Flashloan");
    flashloan = await Flashloan.deploy(provider.address);
    await flashloan.deployed();
  });

  it("Debería poder solicitar un flash loan", async function () {
    const flashLoanParams = {
      FlashLoanPool: provider.address,
      loanAmount: ethers.utils.parseEther("1.0"), // 1 ETH en formato BigNumber
      routes: [],
    };

    // Llamamos a la función requestFlashLoan
    await flashloan.requestFlashLoan(flashLoanParams);

    // Comprobamos que el evento LoanReceived se haya emitido
    await expect(flashloan.requestFlashLoan(flashLoanParams))
      .to.emit(flashloan, "LoanReceived")
      .withArgs(provider.address, ethers.utils.parseEther("1.0"));
  });

  it("Debería devolver el préstamo correctamente", async function () {
    const flashLoanParams = {
      FlashLoanPool: provider.address,
      loanAmount: ethers.utils.parseEther("1.0"), // 1 ETH
      routes: [],
    };

    // Simulamos la solicitud del préstamo
    await flashloan.requestFlashLoan(flashLoanParams);

    // Comprobamos que el préstamo ha sido devuelto correctamente
    await expect(flashloan.executeOperation([provider.address], [ethers.utils.parseEther("1.0")], [ethers.utils.parseEther("0.01")], owner.address, "0x"))
      .to.emit(flashloan, "LoanRepaid")
      .withArgs(provider.address, ethers.utils.parseEther("1.01")); // Incluyendo los intereses
  });
});
