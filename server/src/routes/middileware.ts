import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export const verifyToken = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers['authorization']|| null;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token,JWT_SECRET); 
        
       // console.log("Decoded: ",decoded);
        // @ts-ignore 
        req.userId = decoded.id;
        
        next();

    }catch(e){
        res.status(401).json({
            message:"invalid token"
        })
    }
}