import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateTestCases = () => {
    const cases = [];
    
    // CSV Header
    cases.push(["Test ID", "Module", "Feature", "Test Name", "Action", "Expected Result", "Status"]);

    const modules = [
        { name: "Authentication", prefix: "AUTH" },
        { name: "Product Verification", prefix: "PROD" },
        { name: "Dashboard Analytics", prefix: "DASH" },
        { name: "System Settings", prefix: "SETT" }
    ];

    const generateModuleCases = (mod, count) => {
        // Add a few hardcoded realistic cases for the module
        if (mod.name === "Authentication") {
            cases.push([`${mod.prefix}_001`, mod.name, "Login", "Valid Email & Password", "Enter correct credentials", "Dashboard loads successfully", "Pending"]);
            cases.push([`${mod.prefix}_002`, mod.name, "Login", "Invalid Password", "Enter wrong password", "Error message displayed", "Pending"]);
            cases.push([`${mod.prefix}_003`, mod.name, "OTP Verification", "Valid OTP code", "Enter valid 6-digit OTP", "User session created", "Pending"]);
        } else if (mod.name === "Product Verification") {
            cases.push([`${mod.prefix}_001`, mod.name, "Scan Image", "Valid Product Image", "Upload clear image of product", "Authenticity score > 80%", "Pending"]);
            cases.push([`${mod.prefix}_002`, mod.name, "Scan URL", "Suspicious URL Check", "Paste known scam URL", "Danger warning displayed", "Pending"]);
            cases.push([`${mod.prefix}_003`, mod.name, "History", "View Past Scans", "Navigate to scan history", "List of past scans loaded", "Pending"]);
        } else if (mod.name === "Dashboard Analytics") {
            cases.push([`${mod.prefix}_001`, mod.name, "Overview", "Load Overview Panel", "Access Dashboard", "Total Scans metrics loaded", "Pending"]);
            cases.push([`${mod.prefix}_002`, mod.name, "Charts", "Risk Distribution Chart", "View risk chart", "Pie chart displays correctly", "Pending"]);
            cases.push([`${mod.prefix}_003`, mod.name, "Activity", "Recent Activity Feed", "Scroll down to feed", "Chronological list of events shown", "Pending"]);
        } else if (mod.name === "System Settings") {
            cases.push([`${mod.prefix}_001`, mod.name, "Profile", "Update Name", "Change full name and save", "Success toast and name updated", "Pending"]);
            cases.push([`${mod.prefix}_002`, mod.name, "Preferences", "Toggle Dark Mode", "Click theme switch", "UI colors change instantly", "Pending"]);
            cases.push([`${mod.prefix}_003`, mod.name, "Security", "Change Password", "Enter old and new password", "Password updated successfully", "Pending"]);
        }

        const baseCount = cases.filter(c => c[1] === mod.name).length;
        
        // Procedurally generate the rest up to `count` (300)
        for (let i = baseCount + 1; i <= count; i++) {
            const id = `${mod.prefix}_${i.toString().padStart(3, '0')}`;
            
            const categories = ["Performance", "Security", "Concurrency", "Network Latency", "UI/UX Boundary"];
            const cat = categories[i % categories.length];
            
            let feature, name, action, expected;

            switch(cat) {
                case "Performance":
                    feature = "Load Stress";
                    name = `Rapid Action Trigger (${i}ms interval)`;
                    action = `Trigger primary module action repeatedly at ${i}ms intervals`;
                    expected = "System throttles requests without crashing client";
                    break;
                case "Security":
                    feature = "Injection Guard";
                    name = `Payload Injection Attempt Vol ${i % 50}`;
                    action = `Inject complex payload combination ${i % 50} into primary input`;
                    expected = "Input sanitized before processing";
                    break;
                case "Concurrency":
                    feature = "State Management";
                    name = `Multi-tab State Synchronization Check ${i % 10}`;
                    action = `Perform action in tab A, check reflection in tab B (offset ${i % 10})`;
                    expected = "Global state remains consistent across instances";
                    break;
                case "Network Latency":
                    feature = "Resilience";
                    name = `High Latency Timeout Scenario (${(i * 12) % 3000}ms)`;
                    action = `Simulate network delay of ${(i * 12) % 3000}ms during data fetch`;
                    expected = "Appropriate loading skeletons or timeout fallbacks display";
                    break;
                case "UI/UX Boundary":
                    feature = "Responsiveness";
                    name = `Viewport Squeeze Test (${320 + (i % 800)}px)`;
                    action = `Resize viewport width to ${320 + (i % 800)}px while in module`;
                    expected = "Layout shifts gracefully, no horizontal scrolling or overlap";
                    break;
            }

            cases.push([id, mod.name, feature, name, action, expected, "Pending"]);
        }
    };

    // Generate 300 cases for each of the 4 modules
    modules.forEach(mod => {
        generateModuleCases(mod, 300);
    });

    // Convert to CSV string format, quoting each field to prevent comma collision
    const csvContent = cases.map(row => row.map(v => `"${v}"`).join(",")).join("\n");
    
    // Write to CSV file in the root directory for easy access by GitHub Actions
    const filePath = path.join(__dirname, '..', 'TrueStyle_RealTime_Test_Cases.csv');
    fs.writeFileSync(filePath, csvContent);
    console.log(`Successfully generated Excel-compatible CSV with ${cases.length - 1} test cases at: ${filePath}`);
};

generateTestCases();
