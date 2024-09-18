const hre = require("hardhat");

async function main() {

    // Obtener la cuenta del despliegue
    const [deployer] = await hre.ethers.getSigners();
    console.log("Desplegando contrato con la cuenta:", deployer.address);

    // Obtener balance de la cuenta antes del despliguete:
    
    // Preparar el contrato Side para desplegar
    const SideContract = await hre.ethers.getContractFactory("Side");

    // Direcciones correctas para Mainnet de Polygon
    const aaveProvider = '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb';
    const uniswapPool = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
    const sushiswapPool = '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506';

    // Desplegar el contrato Side
    const sideContract = await SideContract.deploy(aaveProvider, uniswapPool, sushiswapPool);
    console.log("Transacción de despliegue enviada, esperando confirmación...");
    console.log("Detalles de la transacción de despliegue:", sideContract.deployTransaction);

    // Esperar hasta que la transacción de despliegue sea confirmada
   // const txReceipt = await sideContract.deployTransaction();
    
    // Mostrar la dirección del contrato desplegado
    console.log("Contrato Side desplegado en:", sideContract.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
