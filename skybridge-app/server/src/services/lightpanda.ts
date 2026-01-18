import puppeteer, { Browser } from "puppeteer-core";
import { lightpanda } from "@lightpanda/browser";

// Connection modes
type ConnectionMode = "local" | "cloud" | "mock";

export interface ScrapeResult {
    title: string;
    contentLength: number;
    emails: string[];
    techStack: string[];
    socialLinks: SocialLinks;
    rawContent?: string;
}

export interface SocialLinks {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
}

// Common tech stack patterns
const TECH_PATTERNS: Record<string, RegExp[]> = {
    stripe: [/stripe\.com/i, /js\.stripe\.com/i],
    hubspot: [/hubspot\.com/i, /hs-scripts\.com/i, /hbspt/i],
    intercom: [/intercom\.io/i, /widget\.intercom\.io/i],
    segment: [/segment\.com/i, /cdn\.segment\.com/i],
    google_analytics: [/google-analytics\.com/i, /gtag/i, /ga\(/i],
    shopify: [/shopify\.com/i, /cdn\.shopify/i],
    wordpress: [/wp-content/i, /wp-includes/i],
    react: [/react/i, /_react/i],
    vue: [/vue\.js/i, /vuejs/i],
    next: [/next\.js/i, /_next/i],
    vercel: [/vercel\.com/i, /vercel-analytics/i],
    mixpanel: [/mixpanel\.com/i],
    hotjar: [/hotjar\.com/i],
    crisp: [/crisp\.chat/i],
    drift: [/drift\.com/i],
    zendesk: [/zendesk\.com/i],
    freshdesk: [/freshdesk\.com/i],
    calendly: [/calendly\.com/i],
};

// Email extraction regex
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Social links patterns
const SOCIAL_PATTERNS = {
    linkedin: /linkedin\.com\/(?:company|in)\/[a-zA-Z0-9_-]+/i,
    twitter: /(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+/i,
    github: /github\.com\/[a-zA-Z0-9_-]+/i,
    facebook: /facebook\.com\/[a-zA-Z0-9_-]+/i,
    instagram: /instagram\.com\/[a-zA-Z0-9_-]+/i,
};

function extractEmails(content: string): string[] {
    const matches = content.match(EMAIL_REGEX) || [];
    return [...new Set(matches)].filter(
        (email) =>
            !email.includes("example.com") &&
            !email.includes("sentry") &&
            !email.includes("wixpress") &&
            !email.endsWith(".png") &&
            !email.endsWith(".jpg")
    );
}

function detectTechStack(content: string): string[] {
    const detected: string[] = [];
    for (const [tech, patterns] of Object.entries(TECH_PATTERNS)) {
        if (patterns.some((pattern) => pattern.test(content))) {
            detected.push(tech);
        }
    }
    return detected;
}

function extractSocialLinks(content: string): SocialLinks {
    const links: SocialLinks = {};
    for (const [platform, pattern] of Object.entries(SOCIAL_PATTERNS)) {
        const match = content.match(pattern);
        if (match) {
            links[platform as keyof SocialLinks] = `https://${match[0]}`;
        }
    }
    return links;
}

function getConnectionMode(): ConnectionMode {
    if (process.env.LIGHTPANDA_CLOUD_TOKEN) return "cloud";
    if (process.env.LIGHTPANDA_LOCAL === "true") return "local";
    return "mock";
}

let localBrowserProcess: any = null;

async function getLocalBrowser(): Promise<Browser> {
    if (!localBrowserProcess) {
        console.log("[Lightpanda] Starting local browser...");
        localBrowserProcess = await lightpanda.serve({
            host: "127.0.0.1",
            port: 9222,
        });
    }
    return puppeteer.connect({
        browserWSEndpoint: "ws://127.0.0.1:9222",
    });
}

async function getCloudBrowser(): Promise<Browser> {
    const token = process.env.LIGHTPANDA_CLOUD_TOKEN;
    if (!token) throw new Error("LIGHTPANDA_CLOUD_TOKEN is required for cloud mode");

    const endpoint = `wss://euwest.cloud.lightpanda.io/cdp?token=${token}`;
    console.log("[Lightpanda] Connecting to cloud...");

    return puppeteer.connect({
        browserWSEndpoint: endpoint,
    });
}

export async function visitAndScrape(url: string): Promise<ScrapeResult | null> {
    const mode = getConnectionMode();

    if (mode === "mock") {
        // Only warn once in development
        if (process.env.NODE_ENV !== "test") {
            console.warn("[Lightpanda] No credentials set. Using mock response.");
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return {
            title: "Mock Company Page",
            contentLength: 1500,
            emails: ["contact@example.com", "sales@example.com"],
            techStack: ["stripe", "react", "next.js", "hubspot"],
            socialLinks: {
                linkedin: "https://linkedin.com/company/example",
                twitter: "https://twitter.com/example"
            },
        };
    }

    console.log(`[Lightpanda] Visiting ${url} (mode: ${mode})...`);

    let browser: Browser | null = null;
    let page = null;

    try {
        browser = mode === "local" ? await getLocalBrowser() : await getCloudBrowser();

        page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        // Set a reasonable timeout
        // Q68: Use networkidle0 for better lazy-loading support, with shorter timeout
        try {
            await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
        } catch {
            // Fallback to domcontentloaded if networkidle0 times out
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
        }

        const title = await page.title();
        const content = await page.content();

        const emails = extractEmails(content);
        const techStack = detectTechStack(content);
        const socialLinks = extractSocialLinks(content);

        if (mode === "cloud") {
            await browser.close();
        } else if (page) {
            // For local, just close the page
            await page.close();
        }

        return {
            title,
            contentLength: content.length,
            emails,
            techStack,
            socialLinks,
            rawContent: content.substring(0, 5000),
        };
    } catch (error) {
        console.error(`[Lightpanda] Error visiting ${url}:`, error);
        try {
            if (page && !page.isClosed()) await page.close();
            if (browser && mode === "cloud") await browser.close();
        } catch (e) { /* ignore cleanup errors */ }
        return null;
    }
}

export async function closeLightpanda(): Promise<void> {
    if (localBrowserProcess) {
        console.log("[Lightpanda] Shutting down local browser...");
        // @ts-ignore - lightpanda serve return type issues
        if (localBrowserProcess.stdout) localBrowserProcess.stdout.destroy();
        // @ts-ignore
        if (localBrowserProcess.stderr) localBrowserProcess.stderr.destroy();
        if (localBrowserProcess.kill) localBrowserProcess.kill();
        localBrowserProcess = null;
    }
}
