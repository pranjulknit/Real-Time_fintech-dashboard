"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] || null;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // console.log("Decoded: ",decoded);
        // @ts-ignore 
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        res.status(401).json({
            message: "invalid token"
        });
    }
};
exports.verifyToken = verifyToken;
