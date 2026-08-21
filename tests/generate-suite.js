const fs = require('fs');
const path = require('path');

const suiteName = process.argv[2] || 'Tests';
const count = parseInt(process.argv[3]) || 100;
const safeFileName = suiteName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

// Random helper
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Dictionaries per suite
const vocab = {
  Selenium: {
    actions: [
      "Navigate to {page} and click on the {element}",
      "Fill out {form} using {data} and submit",
      "Resize browser to {size} and verify {element} visibility",
      "Double-click {element} and hover over {element}",
      "Wait for {element} to load and extract its text",
      "Login with {data} and assert redirection to {page}",
      "Simulate slow 3G network and reload {page}",
      "Clear cookies and attempt to access {page}"
    ],
    expected: [
      "{element} should be visible and clickable",
      "UI should not overlap and maintain responsive design",
      "User should be redirected within {time}ms",
      "Validation error '{error}' should appear below the input",
      "Toast notification '{error}' should slide in from top-right",
      "DOM should correctly render the {element} without console errors"
    ],
    page: ["Dashboard", "Login Page", "Product Catalog", "User Profile", "Settings Panel", "Checkout Flow"],
    element: ["Submit Button", "Navigation Bar", "Dropdown Menu", "Modal Dialog", "Search Bar", "Hero Image"],
    form: ["Registration Form", "Contact Us Form", "Payment Form", "Search Filter"],
    data: ["valid credentials", "invalid email format", "SQL injection payload", "XSS script", "empty fields", "max length string"],
    size: ["Mobile (375x667)", "Tablet (768x1024)", "Desktop (1920x1080)", "Ultrawide"],
    time: ["200", "500", "1000", "1500"],
    error: ["Invalid input", "Network timeout", "Session expired", "Required field"]
  },
  Appium: {
    actions: [
      "Tap on {element} in the {page} view",
      "Swipe {direction} on the {element} list",
      "Rotate device to {orientation} on {page}",
      "Pinch to zoom on {element}",
      "Background the app for 5 seconds and resume on {page}",
      "Input {data} using native soft keyboard in {element}",
      "Simulate biometric authentication on {page}",
      "Disable Wi-Fi while submitting {form}"
    ],
    expected: [
      "Native {element} should respond instantly",
      "List should scroll smoothly without frame drops",
      "Layout should recalculate for {orientation} correctly",
      "App state should be preserved after resuming",
      "Native keyboard should dismiss automatically",
      "Offline fallback UI should be displayed"
    ],
    page: ["Home Tab", "Scan Screen", "Settings View", "History List", "Auth Modal"],
    element: ["Floating Action Button", "List Item", "Bottom Navigation", "Image Carousel", "Text Input"],
    form: ["Login Form", "Feedback Form", "Search View"],
    data: ["alphanumeric text", "special characters", "pasted long text", "emoji string"],
    direction: ["left", "right", "up", "down"],
    orientation: ["Landscape", "Portrait"]
  },
  API: {
    actions: [
      "Send {method} request to {endpoint} with {payload}",
      "Request {endpoint} missing the {header} header",
      "Call {endpoint} concurrently 50 times with {payload}",
      "Send {method} to {endpoint} with expired JWT token",
      "Submit {method} request to {endpoint} with malformed JSON"
    ],
    expected: [
      "Should return HTTP 200 OK with valid schema",
      "Should return HTTP 401 Unauthorized",
      "Should return HTTP 400 Bad Request with error details",
      "Should return HTTP 429 Too Many Requests",
      "Response time should be under {time}ms",
      "Database should correctly reflect the state change"
    ],
    method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    endpoint: ["/api/auth/login", "/api/users/profile", "/api/products/verify", "/api/analytics/dashboard", "/api/system/health"],
    payload: ["valid JSON body", "empty payload", "SQLi string", "excessively large JSON", "invalid data types"],
    header: ["Authorization", "Content-Type", "Accept", "X-CSRF-Token"],
    time: ["100", "200", "500"]
  },
  Validation: {
    actions: [
      "Input {data} into {field} field",
      "Bypass frontend validation and submit {data} to {field}",
      "Upload {fileType} file exceeding size limits",
      "Inject {data} into query parameters",
      "Submit form with {field} containing trailing spaces"
    ],
    expected: [
      "Input should be sanitized before processing",
      "System should reject and return validation error",
      "File should be blocked by backend middleware",
      "Spaces should be trimmed automatically",
      "Regex validation should catch the invalid pattern"
    ],
    data: ["' OR 1=1--", "<script>alert(1)</script>", "null values", "boundary max+1 length", "non-ASCII unicode characters"],
    field: ["email", "password", "username", "product_id", "search_query"],
    fileType: [".exe", "100MB .pdf", "corrupted .jpg", ".sh script"]
  },
  Deployment: {
    actions: [
      "Trigger zero-downtime deployment script",
      "Verify {env} environment variables are loaded properly",
      "Simulate pod crash and observe restart policy",
      "Check health endpoint during database failover",
      "Rollback to previous version using CI/CD pipeline"
    ],
    expected: [
      "Service should not drop any active connections",
      "Environment should correctly map secrets to config",
      "Pod should restart automatically within 10 seconds",
      "Health check should accurately report degraded state",
      "Previous version should boot and serve traffic successfully"
    ],
    env: ["PRODUCTION", "STAGING", "TESTING"]
  },
  Load: {
    actions: [
      "Ramp up {users} virtual users over 60 seconds hitting {endpoint}",
      "Maintain steady state of {users} users for 5 minutes",
      "Spike test with {users} users instantly on {endpoint}",
      "Soak test for 1 hour at 50% capacity",
      "Execute database-heavy queries with {users} concurrent threads"
    ],
    expected: [
      "95th percentile response time should remain < 200ms",
      "Error rate should remain at 0%",
      "Server CPU should not exceed 80%",
      "Memory footprint should remain stable without leaks",
      "Database connection pool should handle queue without timeouts"
    ],
    users: ["100", "500", "1000", "5000", "10000"],
    endpoint: ["/api/login", "/api/heavy-aggregation", "/api/search"]
  }
};

// Fallback dictionary
const generic = vocab.API;

const generateTestCases = () => {
    const cases = [];
    
    // CSV Header
    cases.push(["Test ID", "Suite", "Test Name", "Action", "Expected Result", "Status"]);

    const suiteVocab = vocab[suiteName] || generic;

    for (let i = 1; i <= count; i++) {
        const id = `TC_${safeFileName.toUpperCase()}_${i.toString().padStart(4, '0')}`;
        
        let actionStr = rand(suiteVocab.actions);
        let expectedStr = rand(suiteVocab.expected);

        // Replace placeholders
        const replacePlaceholders = (str) => {
            let res = str;
            const regex = /\{(\w+)\}/g;
            let match;
            while ((match = regex.exec(res)) !== null) {
                const key = match[1];
                if (suiteVocab[key]) {
                    res = res.replace(match[0], rand(suiteVocab[key]));
                }
            }
            return res;
        };

        actionStr = replacePlaceholders(actionStr);
        // second pass in case generated words have placeholders
        actionStr = replacePlaceholders(actionStr); 
        
        expectedStr = replacePlaceholders(expectedStr);
        expectedStr = replacePlaceholders(expectedStr);

        // Name based on action summary
        const words = actionStr.split(' ').slice(0, 4).join(' ');
        const name = `${words}... Scenario`;
        
        cases.push([id, suiteName, name, actionStr, expectedStr, "Pending"]);
    }

    // Convert to CSV string format
    const csvContent = cases.map(row => row.map(v => `"${v}"`).join(",")).join("\n");
    
    const filePath = path.join(__dirname, '..', `${safeFileName}_test_cases.csv`);
    fs.writeFileSync(filePath, csvContent);
    console.log(`Successfully generated ${count} REALISTIC test cases for ${suiteName} at: ${filePath}`);
};

generateTestCases();
