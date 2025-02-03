import express, { Request, Response, Router, RouterOptions } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const authrouter:any = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

function generateToken(userId:string){
    return jwt.sign({id:userId},JWT_SECRET,{expiresIn:"1h"});
}


authrouter.post("/signup", async (req:Request, res:Response) => {
        const {email,password} = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(existingUser){
            return res.json(401).json({message:"Email already exists"});

        }

        //hashing the password

        const hashedPassword = await bcrypt.hash(password,3);

        //creating the user

        const user = await prisma.user.create({
            data:{
                email,password:hashedPassword
            }
        });

       res.status(201).json({
        message:"user created successfully",
       })

    } catch (error) {
        console.error("signup error",error);
        res.status(500).json({ error: "Internal server error." });
       return;
    }
});

authrouter.post("/login",async(req:Request,res:Response)=>{
    const {email,password} = req.body;
      console.log(`login request ",${email} ${password}`);
    try{
        // finding user by email

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        // if user is not here

        if(!user){
            return res.status(401).json({message:"Invalid credentials"});

        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
         // generating token
         
         if(!isPasswordValid){
              return res.status(401).json({message:"Invalid credentials"});
         }
        const token = generateToken(user.id as unknown as string);
          console.log("backend token generation",token);
        res.status(201).json({
            token
            
        })


    }catch(error){
        console.log("login error",error)
        res.status(500).json({message:"login error"})
    }
})

export default authrouter;