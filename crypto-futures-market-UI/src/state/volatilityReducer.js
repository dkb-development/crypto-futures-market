const initialState = {
    // {
    //     symbol: "BTCUSDT",
    //     avg_mov: 0.14,
    //     curr_mov: 0.29,
    //     avg_vol: 248,
    //     curr_vol: 178
    // }
};

export const volatilityReducer = (state = initialState, action) => {
    switch(action.type){
        case 'updateInitialVolatility':
            // var currState = JSON.parse(JSON.stringify(state));
            // var symbolDetails = action.payload.symbolDetails;
            // var symbol = symbolDetails.symbol;
            // currState[symbol] = symbolDetails;
            // return currState;

            var symbolDetails = action.payload.symbolDetails;
            var symbol = symbolDetails.symbol;

            return {
                ...state,  // Spread the existing state
                [symbol]: symbolDetails,  // Update the specific symbol with new details
            };
        default:
            return state;
    }
}