import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const suiteName = process.argv[2] || 'Tests';
const count = parseInt(process.argv[3]) || 100;
const safeFileName = suiteName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

const generateTestCases = () => {
    const cases = [];
    
    // CSV Header
    cases.push(["Test ID", "Suite", "Test Name", "Action", "Expected Result", "Status"]);

    for (let i = 1; i <= count; i++) {
        const id = `TC_${safeFileName.toUpperCase()}_${i.toString().padStart(4, '0')}`;
        const name = `${suiteName} Scenario ${i}`;
        const action = `Execute sequence for ${suiteName} condition ${i}`;
        const expected = `Output should match expected metrics for condition ${i}`;
        
        cases.push([id, suiteName, name, action, expected, "Pending"]);
    }

    // Convert to CSV string format
    const csvContent = cases.map(row => row.map(v => `"${v}"`).join(",")).join("\n");
    
    const filePath = path.join(__dirname, '..', `${safeFileName}_test_cases.csv`);
    fs.writeFileSync(filePath, csvContent);
    console.log(`Successfully generated ${count} test cases for ${suiteName} at: ${filePath}`);
};

generateTestCases();
