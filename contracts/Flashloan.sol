// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@aave/core-v3/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IFlashloan.sol";  // Asegúrate de que la interfaz está correctamente importada

contract Flashloan is FlashLoanReceiverBase, IFlashloan {
    event LoanReceived(address token, uint256 amount);
    event LoanRepaid(address token, uint256 amount);
    event OperationFailed(string reason);

    constructor(IPoolAddressesProvider provider) FlashLoanReceiverBase(provider) {}

    // Implementación de la función de la interfaz IFlashloan
    function executeFlashLoan(FlashParams memory params) external override {
        requestFlashLoan(params);
    }

    // Función que solicita el flash loan utilizando FlashParams
    function requestFlashLoan(FlashParams memory params) public {
        address receiverAddress = address(this);

        // Declarar e inicializar los arrays correctamente
        address[] memory assets = new address[](1);
        assets[0] = params.routes[0].hops[0].tokenIn;  // Corregimos para obtener el token de entrada

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = params.loanAmount;

        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;  // Modo flash loan puro

        bytes memory data = abi.encode(params);  // Codificar los parámetros para enviarlos

        // Intentar solicitar el préstamo flash
        try POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            address(this),
            data,
            0
        ) {
            emit LoanReceived(assets[0], amounts[0]);
        } catch {
            emit OperationFailed("Flash loan request failed");
        }
    }

    // Callback que maneja la devolución del préstamo
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        FlashParams memory decodedParams = abi.decode(params, (FlashParams));  // Decodificar los parámetros

        for (uint i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i] + premiums[i];
            require(
                IERC20(assets[i]).balanceOf(address(this)) >= amountOwing,
                "Insufficient funds to repay loan"
            );
            IERC20(assets[i]).approve(address(POOL), amountOwing);
            emit LoanRepaid(assets[i], amountOwing);
        }
        return true;
    }
}
