import puppeteer from "puppeteer-core";
import type { ScrapeResult, SocialLinks } from "../types";

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

export async function visitAndScrape(url: string): Promise<ScrapeResult | null> {
  const wsEndpoint = process.env.LIGHTPANDA_WS_ENDPOINT;

  if (!wsEndpoint) {
    console.warn("[Lightpanda] LIGHTPANDA_WS_ENDPOINT not set. Using mock response.");
    return {
      title: "Mock Title",
      contentLength: 0,
      emails: ["contact@example-mock.com"],
      techStack: ["stripe", "react"],
      socialLinks: { linkedin: "https://linkedin.com/company/mock" },
    };
  }

  console.log(`[Lightpanda] Visiting ${url}...`);

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });

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

    await browser.close();

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
    return null;
  }
}
