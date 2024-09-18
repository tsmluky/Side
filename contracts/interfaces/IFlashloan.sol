// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface del Flashloan
interface IFlashloan {
    // Estructura que encapsula los parámetros del Flash Loan
    struct FlashParams {
        address FlashLoanPool;  // Dirección del pool de préstamo flash
        uint256 loanAmount;     // Cantidad total del préstamo
        Route[] routes;         // Rutas de swaps para el préstamo
    }

    // Definición de una ruta (opcional, según lo que utilices)
    struct Route {
    Hop[] hops;
    }
    
    struct Hop {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOutMin;
    }
    // Función para ejecutar el Flashloan con los parámetros encapsulados
    function executeFlashLoan(FlashParams memory params) external;
}
