
/**
 * Filter checks leads against dedup store
 */
export function filterValidatedLeads(leads: any[]): any[] {
    // In a real implementation this would check the dedup store
    // For now in MVP we rely on the checkLeadsForDuplicates call at upload time
    // This helper is mainly here to support the flow logic refactor
    return leads;
}

/**
 * Helper for formatting tier breakdown
 */
export function formatTierBreakdown(breakdown: { tierA: number; tierB: number; tierC: number }): string {
    return `📊 **Tier Breakdown**:\n• 🟢 Tier A (80-100): ${breakdown.tierA} leads\n• 🟡 Tier B (50-79): ${breakdown.tierB} leads\n• 🔴 Tier C (0-49): ${breakdown.tierC} leads`;
}
