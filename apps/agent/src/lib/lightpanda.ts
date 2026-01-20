import puppeteer, { Browser } from "puppeteer-core";
import { lightpanda } from "@lightpanda/browser";
import type { ScrapeResult, SocialLinks } from "../types";

// Connection modes
type ConnectionMode = "local" | "cloud" | "mock";

// Common tech stack patterns to detect
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
};

function extractEmails(content: string): string[] {
  const matches = content.match(EMAIL_REGEX) || [];
  // Filter out common false positives
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

// Determine connection mode based on environment
function getConnectionMode(): ConnectionMode {
  if (process.env.LIGHTPANDA_CLOUD_TOKEN) return "cloud";
  if (process.env.LIGHTPANDA_LOCAL === "true") return "local";
  return "mock";
}

// Local browser instance (reused across calls)
let localBrowserProcess: Awaited<ReturnType<typeof lightpanda.serve>> | null = null;

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

  // Cloud CDP endpoint format
  const endpoint = `wss://euwest.cloud.lightpanda.io/cdp?token=${token}`;
  console.log("[Lightpanda] Connecting to cloud...");

  return puppeteer.connect({
    browserWSEndpoint: endpoint,
  });
}

export async function visitAndScrape(url: string): Promise<ScrapeResult | null> {
  const mode = getConnectionMode();

  if (mode === "mock") {
    console.warn("[Lightpanda] No credentials set. Using mock response.");
    console.warn("  Set LIGHTPANDA_CLOUD_TOKEN for cloud or LIGHTPANDA_LOCAL=true for local");
    return {
      title: "Mock Title",
      contentLength: 0,
      emails: ["contact@example-mock.com"],
      techStack: ["stripe", "react"],
      socialLinks: { linkedin: "https://linkedin.com/company/mock" },
    };
  }

  console.log(`[Lightpanda] Visiting ${url} (mode: ${mode})...`);

  let browser: Browser | null = null;

  try {
    browser = mode === "local" ? await getLocalBrowser() : await getCloudBrowser();

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    const title = await page.title();
    const content = await page.content();

    // Extract all useful data
    const emails = extractEmails(content);
    const techStack = detectTechStack(content);
    const socialLinks = extractSocialLinks(content);

    // Don't close local browser (reused), but close cloud connections
    if (mode === "cloud") {
      await browser.close();
    }

    return {
      title,
      contentLength: content.length,
      emails,
      techStack,
      socialLinks,
      rawContent: content.substring(0, 5000), // Keep first 5k chars for context
    };
  } catch (error) {
    console.error(`[Lightpanda] Error visiting ${url}:`, error);
    if (browser && mode === "cloud") {
      await browser.close().catch(() => {});
    }
    return null;
  }
}

// Cleanup function for graceful shutdown
export async function closeLightpanda(): Promise<void> {
  if (localBrowserProcess) {
    console.log("[Lightpanda] Shutting down local browser...");
    localBrowserProcess.stdout?.destroy();
    localBrowserProcess.stderr?.destroy();
    localBrowserProcess.kill();
    localBrowserProcess = null;
  }
}
