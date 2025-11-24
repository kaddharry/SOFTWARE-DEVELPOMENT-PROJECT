import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log("Testing Groq Key Loading...");
console.log("GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);
if (process.env.GROQ_API_KEY) {
    console.log("Key length:", process.env.GROQ_API_KEY.length);
    console.log("Key start:", process.env.GROQ_API_KEY.substring(0, 5) + "...");
} else {
    console.error("❌ Key is MISSING from process.env");
}
