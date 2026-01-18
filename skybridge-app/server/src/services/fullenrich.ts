/**
 * Full Enrich Service
 * 
 * Handles interaction with Full Enrich API to find verified emails and phone numbers.
 * Docs: https://fullenrich.com/api
 */

const BASE_URL = "https://app.fullenrich.com/api/v1";

interface FullEnrichResponse {
    email?: string;
    email_status?: "valid" | "catchall" | "invalid";
    linkedin?: string;
    phone_numbers?: string[];
    job_title?: string;
    location?: string;
    message?: string;
}

export async function enrichPerson(params: { linkedinUrl?: string; email?: string }): Promise<FullEnrichResponse | null> {
    const apiKey = process.env.FULL_ENRICH_API_KEY;

    if (!apiKey) {
        console.warn("FULL_ENRICH_API_KEY is not set. Skipping enrichment.");
        // Mock response for dev without key
        if (process.env.NODE_ENV === "development") {
            return {
                email: "mock_verified@example.com",
                email_status: "valid",
                phone_numbers: ["+15550199"],
                linkedin: params.linkedinUrl
            };
        }
        return null;
    }

    try {
        const url = params.linkedinUrl ? `${BASE_URL}/enrich/linkedin` : `${BASE_URL}/enrich/email`;
        const body = params.linkedinUrl ? { linkedin_url: params.linkedinUrl } : { email: params.email };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error(`[FullEnrich] API Error ${response.status}:`, await response.text());
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[FullEnrich] Request Failed:", error);
        return null;
    }
}
