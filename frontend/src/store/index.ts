import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "../features/transactionsSlice";
import webSocketReducer from "../features/webSocketSlice";
import authReducer from "../features/authSlice";

export const  store = configureStore({
    reducer:{
        transactions:transactionReducer,
        webSocket:webSocketReducer,
        auth:authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;