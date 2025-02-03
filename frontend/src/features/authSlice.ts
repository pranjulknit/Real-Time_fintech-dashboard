import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { port } from "../config";


// initial State

interface AuthState{
    user: {id:string;email:string;name:string} | null;
    token: string | null;
    loading:boolean;
    error: string| null;
}

const initialState:AuthState = {
   user:null,
   token:localStorage.getItem("token"),
   loading:false,
   error:null,
};

// Thunks for async operations

export const signup = createAsyncThunk(
    "auth/signup",
    async({email,password}:{email:string,password:string},{rejectWithValue})=>{
        try{
            const response = await axios.post(`http://localhost:${port}/api/auth/signup`,{email,password});
            console.log(response)
        }
        catch(error){
            return rejectWithValue(error || "Signup failed");
        }
    }
)

export const login = createAsyncThunk(
    "auth/login",
    async({email,password}:{email:string,password:string},{rejectWithValue})=>{
        try {

            const response = await axios.post(`http://localhost:${port}/api/auth/login`,{email,password});
            const{ token} = response.data;
            localStorage.setItem("token",token);
            axios.defaults.headers.common["Authorization"] = `${token}`;
            return token;
            
        } catch (error) {
            return rejectWithValue(error || "login failed")
        }
    }
)

export const logout = createAsyncThunk("auth/logout",async()=>{
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    return null;
})

//slice

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(signup.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(signup.fulfilled,(state,action)=>{ 
            state.loading = false;
            state.error = null;
         })
        .addCase(signup.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(login.pending,(state)=>{
            state.loading = true;
            state.error =  null;
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.loading = false;
            state.token = action.payload;

        })
        .addCase(login.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload as string;
        })
        //logout
        .addCase(logout.fulfilled,(state)=>{
            state.token=null;
            
        })
    }
});


export default authSlice.reducer;