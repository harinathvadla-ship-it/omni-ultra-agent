import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' })); // Large limit for high-res circuit photos

// Initialize Gemini 2.5 Flash
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "You are OMNI-ULTRA, a professional mobile hardware and software assistant. Focus on Termux automation, motherboard diagnostics, and code optimization."
});

app.post('/chat', async (req, res) => {
    try {
        const { message, image } = req.body;
        let parts = [message];

        // Process Vision data if present
        if (image) {
            parts.push({
                inlineData: {
                    mimeType: "image/jpeg",
                    data: image.split(",")[1]
                }
            });
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("OMNI CORE ERROR:", error);
        res.status(500).json({ reply: "Omni-Core Sync Error. Check API Key/Network." });
    }
});

const PORT = 3010;
app.listen(PORT, () => {
    console.log(`🌌 OMNI-ULTRA Backend Live on Port ${PORT}`);
});
