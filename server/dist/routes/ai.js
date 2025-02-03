"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const express_1 = __importDefault(require("express"));
const airouter = express_1.default.Router();
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
airouter.post("/insights", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await openai.completions.create({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 100,
        });
        res.json(response.choices[0].text);
    }
    catch (error) {
        console.error(error); // Add error logging for debugging
        res.status(500).json({ message: "Error in AI fetching" });
    }
});
exports.default = airouter;
