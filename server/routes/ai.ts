
import OpenAI from "openai";
import express from "express";

const airouter = express.Router();


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


airouter.post("/insights", async (req, res) => {
    const { prompt } = req.body;

    try {
            const response = await openai.completions.create({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 100,
            });

            res.json(response.choices[0].text);
    } catch (error) {
        console.error(error); // Add error logging for debugging
        res.status(500).json({ message: "Error in AI fetching" });
    }
});

export default airouter;


