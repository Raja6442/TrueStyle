const fs = require('fs');
const path = require('path');

const generateTestCases = () => {
    const cases = [];
    
    // CSV Header
    cases.push(["Test ID", "Test Name", "Module", "Action", "Expected Result", "Status"]);

    const modules = ["Login UI", "Authentication", "Validation", "Network", "Security"];
    
    // Hardcoded core manual E2E test cases
    cases.push(["TC_001", "Valid User Login", "Authentication", "Enter correct email and password", "Redirect to dashboard", "Pending"]);
    cases.push(["TC_002", "Valid Admin Login", "Authentication", "Enter admin email and password", "Redirect to admin panel", "Pending"]);
    cases.push(["TC_003", "Invalid Password", "Authentication", "Enter correct email, wrong password", "Show 'Invalid email or password' error", "Pending"]);
    cases.push(["TC_004", "Invalid Email", "Authentication", "Enter non-existent email, any password", "Show 'Invalid email or password' error", "Pending"]);
    cases.push(["TC_005", "Empty Fields", "Validation", "Click login with empty fields", "Browser validation stops submission", "Pending"]);
    cases.push(["TC_006", "Empty Password", "Validation", "Enter email, leave password empty", "Browser validation stops submission", "Pending"]);
    cases.push(["TC_007", "Empty Email", "Validation", "Enter password, leave email empty", "Browser validation stops submission", "Pending"]);
    cases.push(["TC_008", "Malformed Email", "Validation", "Enter 'user@com' without domain", "Browser validation flags invalid format", "Pending"]);
    cases.push(["TC_009", "SQL Injection in Email", "Security", "Enter '' OR 1=1--' as email", "Show 'Invalid email or password' error", "Pending"]);
    cases.push(["TC_010", "XSS Attempt in Email", "Security", "Enter '<script>alert(1)</script>'", "Input sanitized, login fails safely", "Pending"]);
    cases.push(["TC_011", "Network Disconnection", "Network", "Disable Wi-Fi and submit form", "Show 'Network connection issue detected'", "Pending"]);
    cases.push(["TC_012", "Network Reconnection", "Network", "Reconnect Wi-Fi and submit", "Login succeeds without page refresh", "Pending"]);

    // Generate remaining test cases programmatically to reach exactly 300
    for (let i = 13; i <= 300; i++) {
        const id = `TC_${i.toString().padStart(3, '0')}`;
        const mod = modules[i % modules.length];
        
        let name, action, expected;

        switch(mod) {
            case "Login UI":
                name = `UI Responsiveness Check (Width ${1024 - (i % 500)}px)`;
                action = `Resize window to ${1024 - (i % 500)}px width during login`;
                expected = "Login form elements resize without overlapping";
                break;
            case "Authentication":
                name = `Concurrent Login Stress Attempt ${i}`;
                action = `Submit login form rapidly ${i % 5 + 2} times`;
                expected = "Button disabled during loading state, single request sent";
                break;
            case "Validation":
                name = `Password Character Boundary (Length ${i % 50 + 8})`;
                action = `Enter password with length ${i % 50 + 8} containing special chars`;
                expected = "Validation processes string securely without client crash";
                break;
            case "Network":
                name = `High Latency Submission (${i * 15}ms delay)`;
                action = `Throttle network to ${i * 15}ms delay`;
                expected = "Loading indicator persists until response resolves";
                break;
            case "Security":
                name = `Automated Brute Force Simulation Payload ${i}`;
                action = `Attempt authentication sequence ${i} with common dictionary passwords`;
                expected = "Request handled safely without exposing backend internals";
                break;
        }

        cases.push([id, name, mod, action, expected, "Pending"]);
    }

    // Convert to CSV string format, quoting each field to prevent comma collision
    const csvContent = cases.map(row => row.map(v => `"${v}"`).join(",")).join("\n");
    
    // Write to CSV file
    const filePath = path.join(__dirname, 'Login_Test_Cases_Summary.csv');
    fs.writeFileSync(filePath, csvContent);
    console.log(`Successfully generated Excel-compatible CSV with 300 test cases at: ${filePath}`);
};

generateTestCases();
