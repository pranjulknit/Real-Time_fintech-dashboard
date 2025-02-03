"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middileware_1 = require("./routes/middileware");
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ai_1 = __importDefault(require("./routes/ai"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Api routes
app.use("/api/auth", authRoutes_1.default);
app.get("/api/transactions", middileware_1.verifyToken, async (req, res) => {
    const transactions = await prisma.transaction.findMany({
        where: {
            userId: parseInt(req?.userId)
        }
    });
    res.status(200).json({ transactions });
});
app.post("/api/transactions", middileware_1.verifyToken, async (req, res) => {
    const { amount, category, description } = req.body;
    console.log("Amount: ", amount);
    console.log("Category: ", category);
    console.log("Description: ", description);
    console.log("User ID: ", req.userId);
    try {
        const transactions = await prisma.transaction.create({
            data: {
                userId: parseInt(req?.userId),
                amount: parseInt(amount),
                category,
                description
            }
        });
        res.status(200).json({ message: "transaction added" });
    }
    catch (e) {
        res.status(500).json({ message: "transaction addition error" });
    }
});
app.use("/api/ai", ai_1.default);
//WebSocket Setup
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws) => {
    console.log("Client Connected");
    ws.on("message", (data) => {
        const parsedData = JSON.parse(data.toString());
        if (parsedData.type === "transaction") {
            ws.send(JSON.stringify({
                type: "transaction",
                payload: {
                    amount: parsedData.amount,
                    category: parsedData.category,
                    description: parsedData.description
                }
            }));
        }
        else if (parsedData.type === "message") {
            ws.send(JSON.stringify({
                type: "message",
                payload: parsedData.message
            }));
        }
    });
    ws.send(JSON.stringify({ message: "Welcome to the Websocket" }));
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});
