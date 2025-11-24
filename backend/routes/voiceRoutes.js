import express from 'express';
import multer from 'multer';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import os from 'os';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/voice/analyze
router.post('/analyze', upload.single('audio'), async (req, res) => {
    console.log("--- HIT /api/voice/analyze ---"); // Proof of life log
    let tempFilePath = null;
    try {
        // Initialize Groq inside the handler to ensure env vars are loaded
        const apiKey = process.env.GROQ_API_KEY;
        console.log("API Key present:", !!apiKey);
        if (!apiKey) {
            console.error("GROQ_API_KEY is missing in environment variables.");
            return res.status(500).json({ message: "Server configuration error: Missing API Key." });
        }

        const groq = new Groq({
            apiKey: apiKey
        });

        if (!req.file) {
            return res.status(400).json({ message: 'No audio file uploaded.' });
        }

        console.log("Received audio file:", req.file.originalname, req.file.size, "bytes");

        // 1. Save buffer to a temporary file (Groq SDK needs a file stream)
        const tempDir = os.tmpdir();
        tempFilePath = path.join(tempDir, `upload_${Date.now()}.webm`);
        await fs.promises.writeFile(tempFilePath, req.file.buffer);

        // 2. Transcribe Audio (Whisper)
        // We use 'transcriptions' to get the original text in the spoken language (e.g., Hindi)
        // This is often more accurate than direct translation for mixed-language speech.
        const language = req.body.language || 'en';
        console.log(`Sending to Groq Whisper (Language: ${language})...`);
        
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-large-v3",
            response_format: "json",
            language: language, 
        });

        const text = transcription.text;
        console.log("Transcribed Text:", text);

        // 3. Extract JSON (Llama 3)
        console.log("Extracting data with Llama 3...");
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an API that extracts product details from a voice description. 
                    The input text might be in ${language} or a mix of languages.
                    
                    CRITICAL INSTRUCTION: The output JSON values MUST be in ENGLISH. 
                    Translate any non-English input (Hindi, Tamil, etc.) into clear, professional English.

                    Your task is to:
                    1. TRANSLATE the details into English.
                    2. EXTRACT the following fields: 'name' (string), 'price' (number), 'quantity' (number), 'description' (string).
                    3. Return ONLY a JSON object. Do not include markdown formatting or explanations.
                    If a field is missing, do not invent it. Just omit it or set it to null.`
                },
                {
                    role: "user",
                    content: `Extract details from this text: "${text}"`
                }
            ],
            model: "llama-3.1-8b-instant", // Using 8b-instant for speed and reliability
            temperature: 0,
            response_format: { type: "json_object" } // Force JSON mode
        });

        const jsonResponse = JSON.parse(completion.choices[0].message.content);
        console.log("Extracted JSON:", jsonResponse);

        res.json(jsonResponse);

    } catch (err) {
        console.error("--- ERROR ANALYZING VOICE ---");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        if (err.stack) console.error("Stack:", err.stack);
        
        // Check for specific Groq errors
        if (err.message && err.message.includes("API key")) {
             console.error("CRITICAL: Groq API Key appears to be invalid or missing.");
        }

        res.status(500).json({ message: "Server error during voice analysis.", error: err.message });
    } finally {
        // Cleanup temp file
        if (tempFilePath) {
            fs.unlink(tempFilePath, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });
        }
    }
});

export default router;
