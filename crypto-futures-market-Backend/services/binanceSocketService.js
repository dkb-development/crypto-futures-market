import { openSocket } from "../configs/BinanceSocketConfig.js";
import { getSymbolsDetails, updateSymbolDetails } from "../localStorage.js";
import ClientSymbolDetailsModel from "../models/ClientSymbolDetailsModel.js";
import StorageSymbolDetailsModel from "../models/StorageSymbolDetailsModel.js";
import { emitUpdatedSymbolDetails } from "./wsService.js";

const leaverage = 10;
const interval = "1m";

const patternCheckCallbackFunc = (parsedData, currSymbol, currInterval) => {
    // console.log("Inside Callback Function : ",parsedData, currSymbol, currInterval);
    var symbol = currSymbol;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = parsedData.k;
    if(isFinal){
        var candle = {
            symbol, interval, open: parseFloat(open), high: parseFloat(high), low: parseFloat(low), close: parseFloat(close), volume: parseFloat(volume), quoteVolume: parseFloat(quoteVolume), quoteBuyVolume: parseFloat(quoteBuyVolume)
        }

        volume = volume/1000;
        var currVolume = parseFloat(volume.toFixed(2));
        var currSpread = calculateSpreadPercentage(candle.high, candle.low, leaverage);

        // Calculate the buy sell ratio
        quoteVolume = parseFloat(quoteVolume);
        quoteBuyVolume = parseFloat(quoteBuyVolume);
        var quoteSellVolume = quoteVolume - quoteBuyVolume;
        var buySellPercent = parseFloat(((quoteBuyVolume/quoteSellVolume)*100).toFixed(6));

        var symbolHistory;
        var symbolsDetails = getSymbolsDetails();
        if(symbolsDetails && symbolsDetails[symbol]){
            symbolHistory = symbolsDetails[symbol][interval];
        }
        if(!symbolHistory || !symbolHistory instanceof StorageSymbolDetailsModel){
            return;
        }

        // console.log("Symbol History : ", symbolHistory);
        // check whether the current vol is alarming
        var volPercent = checkHighVol(candle, symbol, interval, symbolHistory);
        if(volPercent != -1){
            // send the telegram alert for high volume
            // SendHighVolAlert({
            //     symbol,
            //     interval,
            //     volPercent,
            //     buySellPercent
            // })
        }

        // check whether the current spread is alarming
        var spreadPercent = checkHighSpread(candle, symbol, interval, symbolHistory);
        if(spreadPercent != null){
            // Send the telegram alert for high Spread
            // SendHighSpreadAlert({
            //     symbol,
            //     interval,
            //     direction : (spreadPercent >= 0 ? "UP" : "DOWN"),
            //     spreadPercent,
            //     buySellPercent
            // });
        }

        // set the current vol & spread
        
        var newVols = appendToArray(symbolHistory.getVolumeList(), parseFloat(currVolume));
        var newSpreads = appendToArray(symbolHistory.getSpreadList(), parseFloat(currSpread));

        // set the everage value
        var newAvgSpread = calculateAverage(newSpreads);
        var newAvgVolume = calculateAverage(newVols);

        // Send the updated volatility to client
        emitUpdatedSymbolDetails(new ClientSymbolDetailsModel(symbol, newAvgSpread, newAvgVolume, currSpread, currVolume));

        // set SymbolsDetails in localstorage
        updateSymbolDetails(symbol, interval, new StorageSymbolDetailsModel(newVols, newSpreads, newAvgVolume, newAvgSpread));

        console.log("Updated data for ", symbol, " for interval ", interval);
        // console.log(getSymbolsDetails());
    }
}

const calculateSpreadPercentage = (high, low, leaverage) => {
    return parseFloat(leaverage * (high > low ? 100*Math.abs(high-low)/low : 100*Math.abs(high-low)/high)).toFixed(2);
}

const appendToArray = (lst, val) => {
    lst.push(val);
    lst.shift();
    return lst;
}

const checkHighVol = (currentCandle, currSymbol, currInterval, symbolHistory) => {
    let {symbol, interval, open, high, low, close, volume} = currentCandle;
    var avgVolume = symbolHistory.getAvgVolume;
    var volumePercent = parseFloat(((volume/avgVolume)*100).toFixed(2));

    if(volumePercent >= 300){
        console.log(`Symbol : ${symbol} , Interval : ${interval} -> Current Volume : ${volume.toFixed(2)} & Average Volume : ${avgVolume}`);
        return volumePercent;
    }
    return -1;
}

const checkHighSpread = (currentCandle, currSymbol, currInterval, symbolHistory) => {
    let {symbol, interval, open, high, low, close, volume} = currentCandle;
    var currSpread = parseFloat(leaverage * (high > low ? 100*Math.abs(high-low)/low : 100*Math.abs(high-low)/high)).toFixed(2);
    var avgSpread = symbolHistory.getAvgSpread();
    var spreadPercent = parseFloat(((currSpread/avgSpread)*100).toFixed(2));

    if(spreadPercent >= 300){
        console.log(`Symbol : ${symbol} , Interval : ${interval} -> Current Spread : ${currSpread} & Average Spread : ${avgSpread}`);
        return open > close ? -1*spreadPercent : spreadPercent;
    }
    return null;
}

const calculateAverage = (array) => {
    // Sum up all the elements in the array
    const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Divide the sum by the number of elements in the array
    const average = sum / array.length;

    return parseFloat(average.toFixed(2));
}

export const createSocketsforSymbols = (symbols) => {
    symbols.map((symbol) => {
        openSocket(symbol, interval, patternCheckCallbackFunc)
    });
}