import express, { Request, Response } from "express";
import { verifyToken } from './routes/middileware';

interface CustomRequest extends Request {
    userId?: string;
}


import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import { WebSocketServer } from "ws";
import authrouter from "./routes/authRoutes";

import airouter from "./routes/ai";


dotenv.config();

const app:any = express();
const prisma = new PrismaClient();
app.use(cors());

app.use(express.json());

// Api routes
app.use("/api/auth",authrouter);

app.get("/api/transactions",verifyToken,async(req:CustomRequest,res:Response)=>{
    const transactions = await prisma.transaction.findMany(
        {
            where:{
                userId:parseInt(req?.userId as unknown as string)
            }
        }
    );
    res.status(200).json({transactions});
});

app.post("/api/transactions", verifyToken, async (req: CustomRequest, res: Response) => {
    const {amount,category,description} = req.body;

    console.log("Amount: ",amount);
    console.log("Category: ",category);
    console.log("Description: ",description);
    console.log("User ID: ",req.userId);

    try{
        const transactions = await prisma.transaction.create(
            {
                data:{
                    userId:parseInt(req?.userId as unknown as string),
                    amount:parseInt(amount),
                    category,
                    description
                }
            }
        );
        res.status(200).json({message:"transaction added"})
    }catch(e){
        res.status(500).json({message:"transaction addition error"})
    }
    
})

app.use("/api/ai",airouter);



//WebSocket Setup

const server = http.createServer(app);
const wss =  new WebSocketServer({server});

wss.on("connection", (ws)=>{
    console.log("Client Connected");

    ws.on("message",(data)=>{
        const parsedData = JSON.parse(data.toString());
    if(parsedData.type === "transaction"){
        ws.send(JSON.stringify({
            type:"transaction",
            payload:{
                amount:parsedData.amount,
                category:parsedData.category,
                description:parsedData.description
            }
        }))
    }else if (parsedData.type === "message"){
        ws.send(JSON.stringify({
            type:"message",
            payload:parsedData.message
        }))

    }
    });

    

    

    ws.send(JSON.stringify({message: "Welcome to the Websocket"}));

    
});

const PORT =  process.env.PORT || 4000;

server.listen(PORT,()=>{
    console.log("Server is running on port ",PORT);
    
})