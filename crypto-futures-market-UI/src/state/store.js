import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'

var store = configureStore({
  reducer: rootReducer,
});

export default store;