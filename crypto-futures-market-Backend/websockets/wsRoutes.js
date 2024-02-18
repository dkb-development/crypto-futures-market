// server/websockets/websocketRoutes.js

import { getLatestCandlesticks } from "../services/binanceRestService.js";
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
        const {avgSpread, currSpread, avgVolume, currVolume} = await fetchSymbolVolatility(symbol, interval, limit, leaverage);

        ws.emit("initialVolatilityResponse", 
        {
          symbol: symbol,
          avg_mov: avgSpread,
          curr_mov: currSpread,
          avg_vol: avgVolume,
          curr_vol: currVolume
        });

      }
      catch (error) {
        console.log("Error occured while making api request")
      }
    })
    
  })
};

export default websocketRoutes;
