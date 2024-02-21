
class ClientSymbolDetailsModel {

    constructor(symbol, avgSpread, avgVolume, currSpread, currVolume){
        this.symbol = symbol;
        this.avgSpread = avgSpread;
        this.avgVolume = avgVolume;
        this.currSpread = currSpread;
        this.currVolume = currVolume;
    }

    toJson(){
        return {
            symbol: this.symbol,
            avg_mov: this.avgSpread,
            curr_mov: this.currSpread,
            avg_vol: this.avgVolume,
            curr_vol: this.currVolume
          }
    }

}

export default ClientSymbolDetailsModel;