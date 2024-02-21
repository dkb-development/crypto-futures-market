import { getLatestCandlesticks } from "./binanceRestService.js";

export const fetchSymbolVolatility = async (symbol, interval, limit, leaverage) => {
  try {
      var candleSticks = await getLatestCandlesticks(symbol, interval, limit);
      var vols = [], volIndex = 0, avgVolume=0;
      var spreads = [], spreadIndex = 0, avgSpread=0;
      let totalSpread = 0, totalVol = 0;

      candleSticks.forEach(candle => {
          let [ opentime, open, high, low, close, volume, closeTime, quoteAssetVolume, numberOfTrades, takerBuyBaseAssetVolume, takerBuyQuoteAssetVolume, ignore ] = candle;
          open = parseFloat(open);
          high = parseFloat(high);
          low = parseFloat(low);
          close = parseFloat(close);
          volume = parseFloat(volume);
          closeTime = new Date(closeTime);

          // Make volume to K
          volume = volume/1000;

          var candleStickSpread = leaverage * (high > low ? 100*Math.abs(high-low)/low : 100*Math.abs(high-low)/high);

          vols.push(parseFloat(volume.toFixed(2)));
          spreads.push(parseFloat(candleStickSpread.toFixed(2)));

          totalSpread += candleStickSpread;
          totalVol += volume;
      });
      avgSpread = parseFloat((totalSpread/spreads.length).toFixed(2));
      avgVolume = parseFloat((totalVol/vols.length).toFixed(2));

      // Getting the current vol & spread
      let [ opentime, open, high, low, close, volume, closeTime, quoteAssetVolume, numberOfTrades, takerBuyBaseAssetVolume, takerBuyQuoteAssetVolume, ignore ] = candleSticks[limit-1];
      high = parseFloat(high);
      low = parseFloat(low);
      var currVolume = (parseFloat(volume)/1000).toFixed(2);
      var currSpread = parseFloat(leaverage * (high > low ? 100*Math.abs(high-low)/low : 100*Math.abs(high-low)/high)).toFixed(2);

      return {avgSpread, currSpread, avgVolume, currVolume, vols, spreads};

  }
  catch (error) {
    console.log("Error occured while making api request", error)
  }
}