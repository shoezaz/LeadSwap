/**
 * Lead Deduplication Service
 * 
 * Prevents re-validation of already processed leads:
 * - Generates unique hashes for leads based on email + linkedin + domain
 * - Stores dedup hashes with validation results
 * - Detects duplicates at upload time
 * - Returns cached results for known leads
 * 
 * Implements: US-6.1 to US-6.5
 */

import { createHash } from "crypto";
import { logger } from "../lib/logger.js";
import type { Lead, ScoredLead } from "../types.js";

// In-memory storage (would be replaced with Redis/DB in production)
interface DedupEntry {
    hash: string;
    leadId: string;
    tier: "A" | "B" | "C";
    score: number;
    validatedAt: Date;
    expiresAt: Date;
}

const dedupStore = new Map<string, DedupEntry>();

// Configuration
export const DEDUP_CONFIG = {
    // 12 months retention as per US-6.5
    retentionDays: 365,
    // Credit value per skipped duplicate (for savings calculation)
    creditValuePerDuplicate: 0.50, // €0.50 per skipped duplicate
};

/**
 * Generate a unique hash for a lead
 * Uses: email + linkedinUrl + company domain
 */
export function generateLeadHash(lead: Lead): string {
    const normalizedEmail = (lead.email || "").toLowerCase().trim();
    const normalizedLinkedin = (lead.linkedinUrl || "").toLowerCase().trim();

    // Extract domain from company URL or email
    let domain = "";
    if (lead.url) {
        try {
            domain = new URL(lead.url).hostname.toLowerCase();
        } catch {
            domain = lead.url.toLowerCase();
        }
    } else if (normalizedEmail) {
        domain = normalizedEmail.split("@")[1] || "";
    }

    // Create composite key
    const composite = `${normalizedEmail}|${normalizedLinkedin}|${domain}`;

    // Generate SHA-256 hash
    return createHash("sha256").update(composite).digest("hex").substring(0, 16);
}

/**
 * Check if a lead is a duplicate
 * Returns the cached entry if found and not expired
 */
export function checkDuplicate(lead: Lead): DedupEntry | null {
    const hash = generateLeadHash(lead);
    const entry = dedupStore.get(hash);

    if (!entry) {
        return null;
    }

    // Check expiration
    if (entry.expiresAt < new Date()) {
        dedupStore.delete(hash);
        logger.debug("Expired dedup entry removed", { hash });
        return null;
    }

    return entry;
}

/**
 * Register a validated lead in the dedup store
 */
export function registerValidatedLead(scoredLead: ScoredLead): void {
    const hash = generateLeadHash(scoredLead);

    const entry: DedupEntry = {
        hash,
        leadId: scoredLead.id,
        tier: scoredLead.tier,
        score: scoredLead.score,
        validatedAt: new Date(),
        expiresAt: new Date(Date.now() + DEDUP_CONFIG.retentionDays * 24 * 60 * 60 * 1000),
    };

    dedupStore.set(hash, entry);
    logger.debug("Lead registered in dedup store", {
        hash,
        company: scoredLead.company,
        tier: scoredLead.tier
    });

    // Auto-save on change (US-6.5)
    // Using simple synchronous write for MVP consistency
    saveDedupStore();
}

/**
 * Batch check leads for duplicates
 * Returns: { newLeads, duplicates }
 */
export interface DedupResult {
    newLeads: Lead[];
    duplicates: Array<{
        lead: Lead;
        cachedEntry: DedupEntry;
    }>;
    stats: {
        totalChecked: number;
        newCount: number;
        duplicateCount: number;
        savingsEuros: number;
    };
}

export function checkLeadsForDuplicates(leads: Lead[]): DedupResult {
    const newLeads: Lead[] = [];
    const duplicates: Array<{ lead: Lead; cachedEntry: DedupEntry }> = [];

    for (const lead of leads) {
        const cached = checkDuplicate(lead);
        if (cached) {
            duplicates.push({ lead, cachedEntry: cached });
        } else {
            newLeads.push(lead);
        }
    }

    const savingsEuros = duplicates.length * DEDUP_CONFIG.creditValuePerDuplicate;

    logger.info("Dedup check completed", {
        totalChecked: leads.length,
        newCount: newLeads.length,
        duplicateCount: duplicates.length,
        savingsEuros,
    });

    return {
        newLeads,
        duplicates,
        stats: {
            totalChecked: leads.length,
            newCount: newLeads.length,
            duplicateCount: duplicates.length,
            savingsEuros,
        },
    };
}

/**
 * Register multiple validated leads
 */
export function registerValidatedLeads(scoredLeads: ScoredLead[]): void {
    for (const lead of scoredLeads) {
        registerValidatedLead(lead);
    }
    logger.info(`Registered ${scoredLeads.length} leads in dedup store`);
}

/**
 * Get dedup statistics
 */
export interface DedupStats {
    totalEntries: number;
    entriesByTier: { tierA: number; tierB: number; tierC: number };
    oldestEntry: Date | null;
    newestEntry: Date | null;
}

export function getDedupStats(): DedupStats {
    // Cleanup expired entries first
    const now = new Date();
    for (const [hash, entry] of dedupStore.entries()) {
        if (entry.expiresAt < now) {
            dedupStore.delete(hash);
        }
    }

    const validEntries = Array.from(dedupStore.values());

    const tierA = validEntries.filter(e => e.tier === "A").length;
    const tierB = validEntries.filter(e => e.tier === "B").length;
    const tierC = validEntries.filter(e => e.tier === "C").length;

    const dates = validEntries.map(e => e.validatedAt);

    return {
        totalEntries: validEntries.length,
        entriesByTier: { tierA, tierB, tierC },
        oldestEntry: dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null,
        newestEntry: dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null,
    };
}

/**
 * Clear all dedup entries (for testing/reset)
 */
export function clearDedupStore(): void {
    dedupStore.clear();
    logger.info("Dedup store cleared");
}

/**
 * Format duplicate status message for display
 */
export function formatDuplicateStatus(dedupResult: DedupResult): string {
    if (dedupResult.duplicates.length === 0) {
        return "";
    }

    const byTier = {
        tierA: dedupResult.duplicates.filter(d => d.cachedEntry.tier === "A").length,
        tierB: dedupResult.duplicates.filter(d => d.cachedEntry.tier === "B").length,
        tierC: dedupResult.duplicates.filter(d => d.cachedEntry.tier === "C").length,
    };

    return `ℹ️ ${dedupResult.duplicates.length} leads already validated (Tier A: ${byTier.tierA}, Tier B: ${byTier.tierB}, Tier C: ${byTier.tierC}) - Saved €${dedupResult.stats.savingsEuros.toFixed(2)}`;
}

// ==========================================
// Persistence (US-6.5)
// ==========================================

import * as fs from "fs";
import * as path from "path";

const STORAGE_FILE = path.resolve(process.cwd(), "dedup-store.json");

/**
 * Load dedup store from disk
 */
export function loadDedupStore(): void {
    try {
        if (!fs.existsSync(STORAGE_FILE)) {
            logger.info("No dedup store found, starting fresh");
            return;
        }

        const data = fs.readFileSync(STORAGE_FILE, "utf-8");
        const json = JSON.parse(data);

        dedupStore.clear();

        if (Array.isArray(json)) {
            for (const item of json) {
                // Reconstruct dates
                const entry: DedupEntry = {
                    ...item,
                    validatedAt: new Date(item.validatedAt),
                    expiresAt: new Date(item.expiresAt),
                };

                // Only load if not expired
                if (entry.expiresAt > new Date()) {
                    dedupStore.set(entry.hash, entry);
                }
            }
        }

        logger.info(`Loaded ${dedupStore.size} entries from dedup store`);
    } catch (error) {
        logger.error("Failed to load dedup store", { error });
    }
}

/**
 * Save dedup store to disk
 */
export function saveDedupStore(): void {
    try {
        const entries = Array.from(dedupStore.values());
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(entries, null, 2), "utf-8");
        logger.debug(`Saved ${entries.length} entries to dedup store`);
    } catch (error) {
        logger.error("Failed to save dedup store", { error });
    }
}

// Initialize store on startup
loadDedupStore();
