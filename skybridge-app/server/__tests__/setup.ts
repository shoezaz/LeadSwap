/**
 * Jest Test Setup
 *
 * Configuration and mocks for unit tests
 */

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.EXA_API_KEY = "test-exa-api-key";
process.env.FULL_ENRICH_API_KEY = "test-fullenrich-api-key";
process.env.LOG_LEVEL = "error"; // Suppress logs in tests

// Mock console.log/error to keep test output clean
const originalConsole = { ...console };

beforeAll(() => {
  // Silence console during tests unless debugging
  if (!process.env.DEBUG_TESTS) {
    console.log = jest.fn();
    console.debug = jest.fn();
    console.info = jest.fn();
  }
});

afterAll(() => {
  // Restore console
  console.log = originalConsole.log;
  console.debug = originalConsole.debug;
  console.info = originalConsole.info;
});

// Global test utilities
export const mockLead = {
  id: "test-lead-1",
  company: "Acme Corp",
  email: "john@acme.com",
  name: "John Doe",
  title: "VP Sales",
  url: "https://acme.com",
};

export const mockICP = {
  id: "test-icp-1",
  rawDescription: "SaaS startups, 50-200 employees, France or UK, targeting VP Sales",
  industries: ["SaaS"],
  companySizeMin: 50,
  companySizeMax: 200,
  geographies: ["France", "UK"],
  titles: ["VP Sales", "Head of Sales"],
  keywords: ["B2B", "enterprise"],
  createdAt: new Date(),
};

export const mockEnrichmentData = {
  companyDescription: "Acme Corp is a SaaS company...",
  website: "https://acme.com",
  industry: "SaaS",
  employeeCount: 100,
  location: "Paris, France",
};
