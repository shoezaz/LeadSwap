import { enrichPerson } from "../src/services/fullenrich.js";

console.log("--- Testing Full Enrich (Mock Mode if no key) ---");

// Test with just an email
console.log("Testing with email: patrick@stripe.com");
const result1 = await enrichPerson({ email: "patrick@stripe.com" });
console.log("Result 1:", result1);

// Test with LinkedIn (Mock)
console.log("\nTesting with LinkedIn: https://linkedin.com/in/patrickcollison");
const result2 = await enrichPerson({ linkedinUrl: "https://linkedin.com/in/patrickcollison" });
console.log("Result 2:", result2);
