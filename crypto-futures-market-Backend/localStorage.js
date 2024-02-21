var socketInstance = null;
export const getSocketInstance = () => {
    return socketInstance;
}
export const setSocketInstance = (socket) => {
    socketInstance = socket;
}

var symbolsDetails = {};
export const getSymbolsDetails = () => {
    return symbolsDetails;
}
export const setInitialSymbolDetails = (symbol, interval, symbolDetails) => {
    symbolsDetails[symbol] = {};
    symbolsDetails[symbol][interval] = symbolDetails;
}
export const updateSymbolDetails = (symbol, interval, details) => {
    symbolsDetails[symbol][interval] = details;
}

var serverWebSocket = {};
export const getServerWebSocket = () => {
    return serverWebSocket;
}
export const setServerWebSocket = (socket) => {
    serverWebSocket = socket;
}