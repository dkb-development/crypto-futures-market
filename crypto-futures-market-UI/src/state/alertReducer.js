const initialState = [];

export const alertReducer = (state = initialState, action) => {
    switch(action.type){
        case 'getAlerts':
            return state;
        default:
            return state;
    }
}