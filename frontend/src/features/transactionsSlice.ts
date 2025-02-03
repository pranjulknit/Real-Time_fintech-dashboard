
import {createSlice,PayloadAction} from '@reduxjs/toolkit';


interface Transaction{
    id:number;
    amount:number;
    category:string;
    description:string;
    createdAt:string;
}

interface TransactionState{
    transactions:Transaction[];
    status:"idle"|"loading"|"failed";

}

const initialState: TransactionState = {
    transactions: [],
    status: "idle"
};

const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setTransactions(state,action:PayloadAction<Transaction[]>){
            state.transactions = action.payload;
    },

    addTransaction(state,action:PayloadAction<Transaction>){
            state.transactions.push(action.payload);
    }},
})

export const {setTransactions,addTransaction} = transactionSlice.actions;

export default transactionSlice.reducer;