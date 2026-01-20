
import * as fs from "fs";
import * as path from "path";
import {
    loadDedupStore,
    saveDedupStore,
    registerValidatedLead,
    clearDedupStore,
    checkDuplicate,
    generateLeadHash
} from "../../src/services/dedup-service.js";
import { ScoredLead } from "../../src/types.js";

// Mock fs module
jest.mock("fs");

describe("Dedup Persistence", () => {
    const mockLead: ScoredLead = {
        id: "test-lead-1",
        company: "Test Co",
        email: "test@testco.com",
        url: "https://testco.com",
        score: 85,
        tier: "A",
        tierReason: "High score",
        intentSignals: []
    };

    beforeEach(() => {
        jest.clearAllMocks();
        clearDedupStore();
        (fs.existsSync as jest.Mock).mockReturnValue(false);
    });

    it("should load store on initialization", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        const mockData = JSON.stringify([{
            hash: "somehash",
            leadId: "lead-1",
            tier: "A",
            score: 90,
            validatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 100000).toISOString()
        }]);
        (fs.readFileSync as jest.Mock).mockReturnValue(mockData);

        loadDedupStore();

        expect(fs.readFileSync).toHaveBeenCalled();
    });

    it("should save store when registering lead", () => {
        // Mock save logic
        (fs.writeFileSync as jest.Mock).mockImplementation(() => { });

        registerValidatedLead(mockLead);

        expect(fs.writeFileSync).toHaveBeenCalled();
        const callArgs = (fs.writeFileSync as jest.Mock).mock.calls[0];
        expect(callArgs[0]).toContain("dedup-store.json"); // path
        expect(callArgs[1]).toContain(mockLead.id); // content (leadId is stored)
    });

    it("should handle missing file gracefully", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        loadDedupStore();

        expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    it("should recover from corrupt file", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue("{ invalid json");

        // Should not throw
        loadDedupStore();
    });
});
