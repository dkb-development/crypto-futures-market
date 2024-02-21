// server/websockets/websocketRoutes.js

import { setInitialSymbolDetails } from "../localStorage.js";
import ClientSymbolDetailsModel from "../models/ClientSymbolDetailsModel.js";
import StorageSymbolDetailsModel from "../models/StorageSymbolDetailsModel.js";
import { getLatestCandlesticks } from "../services/binanceRestService.js";
import { createSocketsforSymbols } from "../services/binanceSocketService.js";
import { fetchSymbolVolatility } from "../services/candleStickPropertyService.js";

const leaverage = 10;

const websocketRoutes = (ws) => {
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Send the received message back to the client
    ws.emit(`Server: ${message}`);
    
    // Broadcasting a message to all connected clients
    broadcastMessage(`Broadcast: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on("requestInitialVolatility", (symbols) => {
    var interval = '1m';
    var limit = 20;
    symbols.map(async (symbol) => {
      try {
        const {avgSpread, currSpread, avgVolume, currVolume, vols, spreads} = await fetchSymbolVolatility(symbol, interval, limit, leaverage);
        ws.emit("initialVolatilityResponse", new ClientSymbolDetailsModel(symbol, avgSpread, avgVolume, currSpread, currVolume).toJson());
        setInitialSymbolDetails(symbol, interval, new StorageSymbolDetailsModel(vols, spreads, avgVolume, currVolume));
      }
      catch (error) {
        console.log("Error occured while making api request", error)
      }
    });
    createSocketsforSymbols(symbols);
    
  })
};

export default websocketRoutes;
