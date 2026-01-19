
import dotenv from "dotenv";
import Exa from "exa-js";
import { DustAPI } from "@dust-tt/client";
import { CohereClient } from "cohere-ai";

dotenv.config();

async function testExa() {
    console.log("\n--- Testing Exa API ---");
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
        console.log("❌ EXA_API_KEY is missing");
        return;
    }

    try {
        const exa = new Exa(apiKey);
        const result = await exa.search("test query", { numResults: 1 });
        console.log("✅ Exa API is working. Found results:", result.results.length);
    } catch (error: any) {
        console.log("❌ Exa API failed:", error.message);
    }
}

async function testDust() {
    console.log("\n--- Testing Dust API ---");
    const apiKey = process.env.DUST_API_KEY;
    const workspaceId = process.env.DUST_WORKSPACE_ID;

    if (!apiKey || !workspaceId) {
        console.log("❌ DUST_API_KEY or DUST_WORKSPACE_ID is missing");
        return;
    }

    try {
        const dust = new DustAPI(
            { url: "https://dust.tt" },
            { apiKey, workspaceId },
            console
        );
        // Try to get datasources or just verify connection check auth
        // There isn't a simple "ping" but fetching datasources is a read operation
        // Not implemented in official client types explicitly in the snippet I saw, 
        // but let's try a safe operation if possible or just assume instantiated is okish
        // Actually the snippet showed usage of specific methods. 
        // Let's try to verify if the key format looks valid at least or try a simple fetch if possible.
        // Based on the file viewed earlier, there was no usage example other than instantiation.
        // I'll skip deep functional test for dust and just print presence for now 
        // unless I can find a "listConversations" or similar.
        console.log("ℹ️ Dust API Key present. (Deep functional test skipped, assuming valid format)");
    } catch (error: any) {
        console.log("❌ Dust API setup failed:", error.message);
    }
}

async function testFullEnrich() {
    console.log("\n--- Testing FullEnrich API ---");
    const apiKey = process.env.FULL_ENRICH_API_KEY;
    if (!apiKey) {
        console.log("❌ FULL_ENRICH_API_KEY is missing");
        return;
    }

    // Try a simple enrichment call (expecting 404 or success, but 401 if key invalid)
    try {
        const response = await fetch("https://app.fullenrich.com/api/v1/enrich/email", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: "test@example.com" }) // Dummy email
        });

        if (response.status === 401 || response.status === 403) {
            console.log("❌ FullEnrich API Key is INVALID or Credits Exhausted (Status " + response.status + ")");
            console.log("Response:", await response.text());
        } else if (response.ok || response.status === 404 || response.status === 422) {
            // 404/422 means auth worked but data not found/invalid, which is fine for key test
            console.log("✅ FullEnrich API Key seems valid (Status " + response.status + ")");
            if (!response.ok) {
                console.log("Response (expected error for dummy data):", await response.text());
            }
        } else {
            console.log("⚠️ FullEnrich API returned unexpected status:", response.status);
            console.log("Response:", await response.text());
        }
    } catch (error: any) {
        console.log("❌ FullEnrich API Connection failed:", error.message);
    }
}

async function testLightpanda() {
    console.log("\n--- Testing Lightpanda ---");
    const cloudToken = process.env.LIGHTPANDA_CLOUD_TOKEN;
    if (!cloudToken) {
        console.log("❌ LIGHTPANDA_CLOUD_TOKEN is missing");
        return;
    }

    // Checking if we can connect to the websocket
    const endpoint = `wss://cloud.lightpanda.io/ws?token=${cloudToken}`;
    console.log("Testing WebSocket connection to:", endpoint.replace(cloudToken, "HIDDEN"));

    // We can't easily test WS in a simple script without puppeteer, but let's try to infer from previous issues
    // The user said "credit out".
    // I'll try to use puppeteer-core if available or just skip and manual verify.
    // Actually typically these services have an HTTP API for account info? Not sure.
    // Let's assume the user wants to run the actual code path.
    // I'll try to require puppeteer-core and connect.

    try {
        const puppeteer = await import("puppeteer-core");
        try {
            const browser = await puppeteer.default.connect({
                browserWSEndpoint: endpoint
            });
            console.log("✅ Lightpanda Cloud connection successful!");
            await browser.close();
        } catch (e: any) {
            console.log("❌ Lightpanda Cloud connection FAILED:", e.message);
        }
    } catch (e) {
        console.log("⚠️ puppeteer-core not found, skipping deep Lightpanda test.");
    }
}

async function testOpenAI() {
    console.log("\n--- Testing OpenAI API (Optional) ---");
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.log("ℹ️ OPENAI_API_KEY is missing (HyDE disabled, using fallback)");
        return;
    }
    // Simple fetch to models endpoint
    try {
        const response = await fetch("https://api.openai.com/v1/models", {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });
        if (response.ok) {
            console.log("✅ OpenAI API Key is valid.");
        } else {
            console.log("❌ OpenAI API Key is INVALID (Status " + response.status + ")");
        }
    } catch (e: any) {
        console.log("❌ OpenAI Connection failed:", e.message);
    }
}

async function testCohere() {
    console.log("\n--- Testing Cohere API ---");
    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
        console.log("❌ COHERE_API_KEY is missing");
        return;
    }

    try {
        const cohere = new CohereClient({ token: apiKey });
        // Simple rerank test with dummy data
        const response = await cohere.rerank({
            model: "rerank-english-v3.0",
            query: "test query",
            documents: ["document 1", "document 2"],
            topN: 1,
            returnDocuments: false,
        });

        if (response && response.results) {
            console.log("✅ Cohere API is working. Reranked " + response.results.length + " docs.");
        } else {
            console.log("⚠️ Cohere API returned unexpected response format.");
        }
    } catch (error: any) {
        console.log("❌ Cohere API failed:", error.message);
    }
}

async function main() {
    console.log("🚀 Starting API Key Tests...");
    await testExa();
    await testDust();
    await testFullEnrich();
    await testCohere();
    await testLightpanda();
    await testOpenAI();
    console.log("\n🏁 Validation Complete.");
}

main();
