import { getServerWebSocket } from "../localStorage.js"

export const emitUpdatedSymbolDetails = (ClientSymbolDetailsModel) => {
    var ws = getServerWebSocket();
    ws.emit('updateVolatility', ClientSymbolDetailsModel.toJson());
}