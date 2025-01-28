import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import {PrismaClient} from '@prisma/client';
import dotenv from 'dotenv';
import { log } from "console";
import airouter from "./routes/ai";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Api routes

app.get("/api/transactions",async(req,res)=>{
    const transactions = await prisma.transaction.findMany();
    res.status(200).json(transactions)
})

app.use("/api/ai",airouter);


//WebSocket Setup

const server = http.createServer(app);
const wss =  new WebSocketServer({server});

wss.on("connection", (ws)=>{
    console.log("Client Connected");

    ws.on("message",(message)=>{
        console.log("Received: ",message.toString());
        
    })

    ws.send(JSON.stringify({message: "Welcome to the Websocket"}));

    
});

const PORT =  process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log("Server is running on port ",PORT);
    
})