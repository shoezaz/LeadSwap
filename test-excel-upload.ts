
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

async function testExcelUpload() {
    try {
        // Create a dummy Excel file
        const data = [
            { email: "john@example.com", name: "John Doe", company: "Acme Inc", title: "CEO" },
            { email: "jane@example.com", name: "Jane Doe", company: "Globex" }, // Missing title
            { email: "invalid-email", name: "Bob", company: "Bad Data" } // Invalid email
        ];

        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, "Leads");

        const filePath = path.join(__dirname, "test-leads.xlsx");
        XLSX.writeFile(workbook, filePath);
        console.log(`Created test file at ${filePath}`);

        // Read file as base64
        const fileBuffer = fs.readFileSync(filePath);
        const base64Data = fileBuffer.toString('base64');

        // Make request
        console.log("Sending request to http://localhost:3000/api/upload...");

        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: "test-user-1",
                csvBase64: base64Data
            })
        });

        const responseData = await response.json() as any;

        console.log("\nResponse:");
        console.log(JSON.stringify(responseData, null, 2));

        // Cleanup
        // fs.unlinkSync(filePath); // Commented out to inspect if needed

        if (responseData.success && responseData.stats.validRows === 2) {
            console.log("\n✅ Test Passed!");
        } else {
            console.log("\n❌ Test Failed: Unexpected result");
        }

    } catch (error) {
        console.error("\n❌ Test Failed:", error instanceof Error ? error.message : error);
    }
}

testExcelUpload();
