
import dotenv from "dotenv";
import Exa from "exa-js";
import path from "path";

// Load env from root
dotenv.config({ path: path.join(process.cwd(), ".env") });

async function testExa() {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
        console.error("❌ EXA_API_KEY is missing in .env");
        process.exit(1);
    }

    console.log(`Checking Exa Key: ${apiKey.substring(0, 5)}...`);

    try {
        const exa = new Exa(apiKey);
        // Simple search to validate key
        const result = await exa.search("test");
        console.log("✅ Exa Key is VALID! Found results:", result.results.length);
    } catch (error: any) {
        console.error("❌ Exa Key is INVALID or Service Down:");
        console.error(error.message);
        process.exit(1);
    }
}

testExa();
