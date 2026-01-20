/**
 * Dust.tt API Client
 * 
 * Provides connection to Dust API for:
 * - Creating/managing conversations
 * - Storing data in DataSources (for ICP memory)
 */

import { DustAPI } from "@dust-tt/client";

let dustClient: DustAPI | null = null;

/**
 * Get or create Dust API client instance
 */
export function getDustClient(): DustAPI {
    if (!process.env.DUST_API_KEY) {
        throw new Error("DUST_API_KEY is missing. Set it in your .env file.");
    }
    if (!process.env.DUST_WORKSPACE_ID) {
        throw new Error("DUST_WORKSPACE_ID is missing. Set it in your .env file.");
    }

    if (!dustClient) {
        dustClient = new DustAPI(
            {
                url: "https://dust.tt",
            },
            {
                apiKey: process.env.DUST_API_KEY,
                workspaceId: process.env.DUST_WORKSPACE_ID,
            },
            console
        );
    }

    return dustClient;
}

/**
 * Get workspace ID
 */
export function getWorkspaceId(): string {
    if (!process.env.DUST_WORKSPACE_ID) {
        throw new Error("DUST_WORKSPACE_ID is missing.");
    }
    return process.env.DUST_WORKSPACE_ID;
}

/**
 * Check if Dust is configured
 */
export function isDustConfigured(): boolean {
    return !!(process.env.DUST_API_KEY && process.env.DUST_WORKSPACE_ID);
}
