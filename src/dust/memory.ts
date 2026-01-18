/**
 * Dust Memory - ICP Storage & Retrieval
 * 
 * Uses local file storage for MVP (Dust DataSource for production)
 * Stores ICPs per user with full CRUD operations
 */

import * as fs from "fs";
import * as path from "path";
import type { ICP } from "../types/icp";

// Storage directory
const STORAGE_DIR = path.join(process.cwd(), ".leadswap-data");
const ICP_FILE = path.join(STORAGE_DIR, "icps.json");

// In-memory cache
let icpCache: Map<string, ICP> = new Map();
let cacheLoaded = false;

/**
 * Ensure storage directory exists
 */
function ensureStorageDir(): void {
    if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
}

/**
 * Load ICPs from disk into cache
 */
function loadCache(): void {
    if (cacheLoaded) return;

    ensureStorageDir();

    if (fs.existsSync(ICP_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(ICP_FILE, "utf-8"));
            icpCache = new Map(Object.entries(data));
            console.log(`[Memory] Loaded ${icpCache.size} ICPs from disk`);
        } catch (err) {
            console.error("[Memory] Error loading ICPs:", err);
            icpCache = new Map();
        }
    }

    cacheLoaded = true;
}

/**
 * Save cache to disk
 */
function saveCache(): void {
    ensureStorageDir();

    const data: Record<string, ICP> = {};
    icpCache.forEach((value, key) => {
        data[key] = value;
    });

    fs.writeFileSync(ICP_FILE, JSON.stringify(data, null, 2));
}

/**
 * Save an ICP for a user
 */
export async function saveICP(userId: string, icp: Partial<ICP>): Promise<ICP> {
    loadCache();

    const fullICP: ICP = {
        userId,
        industries: icp.industries || [],
        companySizes: icp.companySizes || { min: 0, max: 100000 },
        geoTargets: icp.geoTargets || [],
        titles: icp.titles || [],
        keywords: icp.keywords || [],
        excludeKeywords: icp.excludeKeywords || [],
        createdAt: icp.createdAt || new Date(),
        updatedAt: new Date(),
    };

    icpCache.set(userId, fullICP);
    saveCache();

    console.log(`[Memory] Saved ICP for user ${userId}`);
    return fullICP;
}

/**
 * Get an ICP for a user
 */
export async function getICP(userId: string): Promise<ICP | null> {
    loadCache();

    const icp = icpCache.get(userId);
    if (!icp) {
        console.log(`[Memory] No ICP found for user ${userId}`);
        return null;
    }

    console.log(`[Memory] Retrieved ICP for user ${userId}`);
    return icp;
}

/**
 * Update an existing ICP
 */
export async function updateICP(
    userId: string,
    changes: Partial<ICP>
): Promise<ICP | null> {
    loadCache();

    const existing = icpCache.get(userId);
    if (!existing) {
        console.log(`[Memory] No ICP found to update for user ${userId}`);
        return null;
    }

    const updated: ICP = {
        ...existing,
        ...changes,
        userId, // Ensure userId is not overwritten
        updatedAt: new Date(),
    };

    icpCache.set(userId, updated);
    saveCache();

    console.log(`[Memory] Updated ICP for user ${userId}`);
    return updated;
}

/**
 * Delete an ICP
 */
export async function deleteICP(userId: string): Promise<boolean> {
    loadCache();

    if (!icpCache.has(userId)) {
        return false;
    }

    icpCache.delete(userId);
    saveCache();

    console.log(`[Memory] Deleted ICP for user ${userId}`);
    return true;
}

/**
 * List all ICPs (admin function)
 */
export async function listAllICPs(): Promise<ICP[]> {
    loadCache();
    return Array.from(icpCache.values());
}

/**
 * Format ICP for display
 */
export function formatICPForDisplay(icp: ICP): string {
    const parts: string[] = [];

    if (icp.industries.length > 0) {
        parts.push(`📊 Industries: ${icp.industries.join(", ")}`);
    }

    if (icp.companySizes.min > 0 || icp.companySizes.max < 100000) {
        parts.push(`👥 Company Size: ${icp.companySizes.min}-${icp.companySizes.max} employees`);
    }

    if (icp.geoTargets.length > 0) {
        parts.push(`🌍 Geography: ${icp.geoTargets.join(", ")}`);
    }

    if (icp.titles.length > 0) {
        parts.push(`👔 Titles: ${icp.titles.join(", ")}`);
    }

    if (icp.keywords.length > 0) {
        parts.push(`🔑 Keywords: ${icp.keywords.join(", ")}`);
    }

    return parts.join("\n");
}
