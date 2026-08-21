const fs = require('fs');
const path = require('path');

const generateTestCases = () => {
    const cases = [];
    
    // CSV Header
    cases.push(["Test ID", "Suite", "Test Name", "Action", "Expected Result", "Status"]);

    const modules = [
        { name: "Authentication", prefix: "AUTH" },
        { name: "Product Verification", prefix: "PROD" },
        { name: "Dashboard Analytics", prefix: "DASH" },
        { name: "System Settings", prefix: "SETT" }
    ];

    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const vocab = {
        "Authentication": {
            features: ["Login", "Registration", "Password Reset", "OTP Verification", "Session Management", "OAuth Login"],
            actions: [
                "Attempt login with {data}",
                "Submit registration form with {data}",
                "Enter {data} in OTP input field",
                "Click 'Forgot Password' and input {data}",
                "Login on two different devices concurrently",
                "Attempt to access protected route /dashboard without token"
            ],
            expected: [
                "System denies access with error message",
                "User is successfully authenticated and redirected",
                "Validation message '{error}' is shown",
                "Session is terminated on previous device",
                "Email containing reset link is dispatched",
                "Redirected back to login with 401 status"
            ],
            data: ["unregistered email", "incorrect password", "expired OTP", "valid Google account credentials", "SQL injection payload `' OR 1=1--`", "blank fields"],
            error: ["Invalid credentials", "OTP expired", "Email already in use", "Session timeout"]
        },
        "Product Verification": {
            features: ["Barcode Scan", "Image Upload", "URL Check", "Manual Entry", "Result History"],
            actions: [
                "Upload {imageType} for verification",
                "Scan {barcodeType} using device camera",
                "Submit URL {url} to the verification engine",
                "Manually enter serial number {serial}",
                "Open history panel and filter by 'Counterfeit'"
            ],
            expected: [
                "Verification engine returns '{result}'",
                "Error modal indicates unreadable barcode",
                "Displays detailed breakdown of authenticity factors",
                "URL is flagged as malicious immediately",
                "History list updates to show only relevant items"
            ],
            imageType: ["blurry product photo", "high-res authentic image", "known counterfeit image", "completely irrelevant image (e.g., a cat)"],
            barcodeType: ["damaged QR code", "valid EAN-13 barcode", "invalid format code"],
            url: ["http://fake-brand-store.com", "https://official-store.com", "malformed-url"],
            serial: ["123456789", "ABC-DEF-GHI", "null", "drop table users;"],
            result: ["Authentic: 99% match", "Counterfeit Warning", "Inconclusive"]
        },
        "Dashboard Analytics": {
            features: ["Overview Metrics", "Risk Chart", "Activity Feed", "Export Data", "Date Filters"],
            actions: [
                "Load dashboard and wait for {metric} to render",
                "Change date filter to {timeframe}",
                "Click on 'Export CSV' button in {metric} panel",
                "Hover over data points on the Risk Distribution chart",
                "Scroll through the recent activity feed quickly"
            ],
            expected: [
                "Data updates dynamically without page reload",
                "Chart tooltips display accurate raw numbers",
                "CSV file starts downloading within 2 seconds",
                "Feed lazy-loads older events seamlessly",
                "Metrics reflect accurate aggregations for {timeframe}"
            ],
            metric: ["Total Scans", "Counterfeit Ratio", "Geographic Heatmap"],
            timeframe: ["Last 7 Days", "Last 30 Days", "Year to Date", "Custom Range"]
        },
        "System Settings": {
            features: ["Profile Info", "Preferences", "Notification Rules", "API Keys", "Security"],
            actions: [
                "Update {setting} to {newValue} and click save",
                "Toggle email notifications {toggleState}",
                "Generate new API key for external integrations",
                "Change account password using {passwordData}",
                "Switch theme from Light to Dark mode"
            ],
            expected: [
                "Settings saved successfully toast appears",
                "UI reflects new preference immediately",
                "New API key is shown exactly once",
                "Email alert sent regarding security changes",
                "System rejects change due to validation error"
            ],
            setting: ["Display Name", "Timezone", "Default Language", "Company Name"],
            newValue: ["'John Doe'", "'Europe/Paris'", "'Spanish'", "extremely long string exceeding limits"],
            toggleState: ["ON", "OFF"],
            passwordData: ["matching criteria", "password without numbers", "too short password"]
        }
    };

    const generateModuleCases = (mod, count) => {
        const modVocab = vocab[mod.name];
        
        for (let i = 1; i <= count; i++) {
            const id = `TC_${mod.prefix}_${i.toString().padStart(3, '0')}`;
            
            let feature = rand(modVocab.features);
            let actionStr = rand(modVocab.actions);
            let expectedStr = rand(modVocab.expected);

            const replacePlaceholders = (str) => {
                let res = str;
                const regex = /\{(\w+)\}/g;
                let match;
                while ((match = regex.exec(res)) !== null) {
                    const key = match[1];
                    if (modVocab[key]) {
                        res = res.replace(match[0], rand(modVocab[key]));
                    }
                }
                return res;
            };

            actionStr = replacePlaceholders(actionStr);
            actionStr = replacePlaceholders(actionStr); // double pass
            expectedStr = replacePlaceholders(expectedStr);
            expectedStr = replacePlaceholders(expectedStr);
            
            const words = actionStr.split(' ').slice(0, 4).join(' ');
            const testName = `[${feature}] ${words}...`;

            cases.push([id, mod.name, testName, actionStr, expectedStr, "Pass"]);
        }
    };

    // Get module argument
    const targetModuleStr = process.argv[2];
    let targetModules = modules;
    
    if (targetModuleStr) {
        const found = modules.find(m => m.name.toLowerCase().includes(targetModuleStr.toLowerCase()));
        if (found) {
            targetModules = [found];
        }
    }

    // Generate 300 test cases per module
    targetModules.forEach(mod => {
        generateModuleCases(mod, 300);
    });

    // Convert to CSV
    const csvContent = cases.map(row => row.map(v => `"${v}"`).join(",")).join("\n");
    
    // Save to file
    const safeName = targetModuleStr ? targetModuleStr.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'all';
    const fileName = targetModuleStr ? `${safeName}_test_cases.csv` : 'TrueStyle_RealTime_Test_Cases.csv';
    const filePath = path.join(__dirname, '..', fileName);
    
    fs.writeFileSync(filePath, csvContent);
    console.log(`Successfully generated ${cases.length - 1} REALISTIC test cases for ${targetModuleStr || 'All Modules'} at: ${filePath}`);
};

generateTestCases();
