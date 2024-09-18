import { Fetcher, Route, Token } from '@uniswap/sdk';
import axios from 'axios';

// Función para obtener precios de Uniswap
async function getUniswapPrice(tokenA: string, tokenB: string) {
    const token0 = await Fetcher.fetchTokenData(chainId, tokenA);
    const token1 = await Fetcher.fetchTokenData(chainId, tokenB);
    const pair = await Fetcher.fetchPairData(token0, token1);
    const route = new Route([pair], token0);
    return route.midPrice.toSignificant(6);  // Precio con 6 decimales
}

// Función para obtener precios de Sushiswap
async function getSushiswapPrice(tokenA: string, tokenB: string) {
    const token0 = await Fetcher.fetchTokenData(chainId, tokenA);
    const token1 = await Fetcher.fetchTokenData(chainId, tokenB);
    const pair = await Fetcher.fetchPairData(token0, token1);
    const route = new Route([pair], token0);
    return route.midPrice.toSignificant(6);  // Precio con 6 decimales
}

// Función para obtener precios de XeggeX usando su API
async function getXeggeXPrice(pair: string) {
    try {
        const response = await axios.get(`https://api.xeggex.com/v2/market/ticker/${pair}`);
        return response.data.price;  // Devuelve el precio
    } catch (error) {
        console.error('Error al obtener precio de XeggeX:', error);
        return null;
    }
}

// Función principal que compara precios entre DEXs
async function comparePrices() {
    const tokenA = 'ETH';
    const tokenB = 'USDC';

    const uniswapPrice = await getUniswapPrice(tokenA, tokenB);
    const sushiswapPrice = await getSushiswapPrice(tokenA, tokenB);
    const xeggexPrice = await getXeggeXPrice(`${tokenA}_${tokenB}`);

    console.log('Precio en Uniswap:', uniswapPrice);
    console.log('Precio en Sushiswap:', sushiswapPrice);
    console.log('Precio en XeggeX:', xeggexPrice);

    // Detectar oportunidad de arbitraje
    if (uniswapPrice > xeggexPrice) {
        console.log('Oportunidad de arbitraje detectada entre Uniswap y XeggeX');
        // Ejecutar swaps aquí
    } else if (sushiswapPrice > xeggexPrice) {
        console.log('Oportunidad de arbitraje detectada entre Sushiswap y XeggeX');
        // Ejecutar swaps aquí
    }
}

// Ejecutar comparación de precios
comparePrices();
