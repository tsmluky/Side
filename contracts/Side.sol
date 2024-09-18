// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@aave/core-v3/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFlashloan.sol";  // Asegúrate de que la interfaz está correctamente importada

contract Side is FlashLoanReceiverBase, Ownable {
    address public uniswapPool;
    address public sushiswapPool;

    constructor(IPoolAddressesProvider provider, address _uniswapPool, address _sushiswapPool)
        FlashLoanReceiverBase(provider)
        Ownable(msg.sender)
    {
        uniswapPool = _uniswapPool;
        sushiswapPool = _sushiswapPool;
    }

    // Función para ejecutar la lógica del préstamo flash
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        for (uint i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i] + premiums[i];
            IERC20(assets[i]).approve(address(POOL), amountOwing);  // Uso correcto de IERC20 para aprobar el reembolso
        }
        return true;
    }

    // Función para solicitar un flash loan, utilizando FlashParams desde IFlashloan.sol
    function requestFlashLoan(IFlashloan.FlashParams memory params) public {
        address receiverAddress = address(this);

        // Definir las variables assets, amounts y modes
        address[] memory assets = new address[](1);
        assets[0] = params.routes[0].hops[0].tokenIn;  // Obtener el primer token de la primera ruta

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = params.loanAmount;

        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;  // Modo flash loan puro

        bytes memory paramsData = "";  // Usar un nombre diferente para evitar conflicto con `params`
        uint16 referralCode = 0;

        // Solicitar el flash loan desde Aave
        POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            address(this),
            paramsData,
            referralCode
        );
    }
}
