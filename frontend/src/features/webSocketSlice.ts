import { createSlice,PayloadAction } from "@reduxjs/toolkit";


interface WebSocketState{
    messages:string[]
}

const initialState:WebSocketState = {
    messages:[]
}

const webSocketSlice = createSlice({
    name:"webSocket",
    initialState,
    reducers:{
        addMessage(state,action:PayloadAction<string>){
            state.messages.push(action.payload);
        },

    }
})

export const {addMessage} = webSocketSlice.actions;
export default webSocketSlice.reducer;