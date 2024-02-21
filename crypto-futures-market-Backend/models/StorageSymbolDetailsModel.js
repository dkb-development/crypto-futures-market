
class StorageSymbolDetailsModel{
    constructor(volumeList, spreadList, avgVolume, avgSpread){
        this.volumeList = volumeList;
        this.spreadList = spreadList;
        this.avgVolume = parseFloat(avgVolume);
        this.avgSpread = parseFloat(avgSpread);
    }

    getAvgVolume() {
        return parseFloat(this.avgVolume);
    }

    getAvgSpread() {
        return parseFloat(this.avgSpread);
    }

    getVolumeList() {
        return this.volumeList;
    }

    getSpreadList() {
        return this.spreadList;
    }

    toJson(){
        return {
            volumeList: this.volumeList,
            spreadList: this.spreadList,
            avgVolume: this.avgVolume,
            avgSpread: this.avgSpread
        }
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

export default StorageSymbolDetailsModel;