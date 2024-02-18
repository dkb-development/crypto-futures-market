export const fetchInitialVolatilityAction = () => {

}

export const updateInitialVolatilityAction = (symbolDetails) => {
    return {
        type: 'updateInitialVolatility',
        payload: {
            symbolDetails
        }
    }
}