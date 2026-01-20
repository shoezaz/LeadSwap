import { visitAndScrape, closeLightpanda } from "../src/services/lightpanda.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const url = process.argv[2] || "https://stripe.com";
    console.log(`Testing Lightpanda scraping for: ${url}`);
    console.log(`Mode: ${process.env.LIGHTPANDA_CLOUD_TOKEN ? 'CLOUD' : process.env.LIGHTPANDA_LOCAL === 'true' ? 'LOCAL' : 'MOCK'}`);

    try {
        const start = Date.now();
        const result = await visitAndScrape(url);
        const duration = Date.now() - start;

        if (result) {
            console.log("\n✅ Scrape Successful!");
            console.log(`⏱️ Duration: ${duration}ms`);
            console.log("\n--- Result ---");
            console.log(`Title: ${result.title}`);
            console.log(`Emails: ${result.emails.join(", ")}`);
            console.log(`Tech Stack: ${result.techStack.join(", ")}`);
            console.log(`Social Links:`, JSON.stringify(result.socialLinks, null, 2));
            console.log(`Content Length: ${result.contentLength} chars`);
        } else {
            console.log("\n❌ Scrape Failed (returned null)");
        }
    } catch (error) {
        console.error("\n❌ Error:", error);
    } finally {
        await closeLightpanda();
    }
}

main();
