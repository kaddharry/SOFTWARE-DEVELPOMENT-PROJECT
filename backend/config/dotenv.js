import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// This creates an absolute path to your .env file to ensure it's always found.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We go up one directory from /config to find the .env file in the /backend folder.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
