"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authrouter = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
function generateToken(userId) {
    return jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
}
authrouter.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            return res.json(401).json({ message: "Email already exists" });
        }
        //hashing the password
        const hashedPassword = await bcryptjs_1.default.hash(password, 3);
        //creating the user
        const user = await prisma.user.create({
            data: {
                email, password: hashedPassword
            }
        });
        res.status(201).json({
            message: "user created successfully",
        });
    }
    catch (error) {
        console.error("signup error", error);
        res.status(500).json({ error: "Internal server error." });
        return;
    }
});
authrouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // finding user by email
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        // if user is not here
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        // generating token
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user.id);
        console.log("backend token generation", token);
        res.status(201).json({
            token
        });
    }
    catch (error) {
        res.status(500).json({ message: "login error" });
    }
});
exports.default = authrouter;
