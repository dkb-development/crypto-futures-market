import { combineReducers } from "@reduxjs/toolkit";
import { alertReducer } from "./alertReducer";
import { volatilityReducer } from "./volatilityReducer";

const rootReducer = combineReducers({
    volatility: volatilityReducer,
    alert: alertReducer
});

export default rootReducer;