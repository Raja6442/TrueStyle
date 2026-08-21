const XLSX = require('xlsx');

function createFindingsWorkbook() {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Security Findings
    const findings = [
        ['Finding ID', 'Severity', 'Category', 'CWE', 'Status', 'File', 'Endpoint', 'Description', 'Impact', 'Recommended Fix', 'Verification'],
        ['SEC-001', 'Critical', 'Secrets Management', 'CWE-798', 'Confirmed', 'server/.env', 'N/A', 'SMTP credentials potentially committed to repository', 'Credential exposure enables email abuse', 'Add server/.env to .gitignore, rotate credentials', 'git ls-files server/.env'],
        ['SEC-002', 'Critical', 'Secrets Management', 'CWE-798', 'Confirmed', 'src/supabaseClient.js', 'N/A', 'Supabase URL and key hardcoded in source code', 'Database credentials embedded in client bundle', 'Use environment variables via import.meta.env', 'Search for hardcoded strings'],
        ['SEC-003', 'High', 'Authentication', 'CWE-330', 'Confirmed', 'src/context/AuthContext.tsx', 'Registration', 'OTP generated with Math.random() and stored in localStorage', 'OTP is predictable and readable from browser', 'Generate OTP server-side with crypto.randomInt()', 'Inspect AuthContext.tsx signUp()'],
        ['SEC-004', 'High', 'Authentication', 'CWE-312', 'Confirmed', 'src/context/AuthContext.tsx', 'Registration', 'Plaintext password stored in localStorage during registration', 'Password exposed to XSS and browser access', 'Never store passwords in browser storage', 'Check localStorage for truestyle_pending_user'],
        ['SEC-005', 'High', 'Authorization', 'CWE-269', 'Potential', 'supabase_schema.sql', 'profiles table', 'RLS FOR ALL policy allows users to UPDATE own role field', 'User can escalate to admin privileges', 'Split RLS policies, restrict role column updates', 'Attempt role update as non-admin'],
        ['SEC-006', 'High', 'SSRF', 'CWE-918', 'Confirmed', 'server/index.js', 'POST /api/scrape', 'User-supplied URL passed directly to axios.get() with no restrictions', 'Server can be used to access internal services', 'Add URL validation, domain allowlist, private IP blocking', 'Review server/index.js lines 58-76'],
        ['SEC-007', 'High', 'Authentication', 'CWE-306', 'Confirmed', 'server/index.js', 'All endpoints', 'No authentication on backend API endpoints', 'Anyone can send OTP emails and scrape URLs', 'Verify Supabase JWT on every request', 'Call endpoints without auth token'],
        ['SEC-008', 'Medium', 'Configuration', 'CWE-942', 'Confirmed', 'server/index.js', 'All endpoints', 'CORS allows all origins', 'Any website can call backend APIs', 'Restrict CORS to frontend origins only', 'Check Access-Control-Allow-Origin header'],
        ['SEC-009', 'Medium', 'Configuration', 'CWE-770', 'Confirmed', 'server/index.js', 'All endpoints', 'No explicit request body size limit', 'Resource exhaustion via large payloads', 'Set express.json({ limit: "10kb" })', 'Review middleware config'],
        ['SEC-010', 'Medium', 'Configuration', 'CWE-693', 'Confirmed', 'server/index.js', 'All responses', 'No security headers (Helmet missing)', 'Exposure to clickjacking, MIME sniffing', 'Install and configure helmet', 'Inspect response headers'],
        ['SEC-011', 'Medium', 'Information Disclosure', 'CWE-209', 'Confirmed', 'server/index.js', 'POST /api/send-otp, POST /api/scrape', 'Error responses expose internal error.message', 'Reveals infrastructure details to attackers', 'Return generic error messages', 'Send malformed request, inspect response'],
        ['SEC-012', 'Medium', 'Authorization', 'CWE-285', 'Confirmed', 'src/context/AuthContext.tsx', 'Registration/Login', 'Admin role assigned based on email containing "admin"', 'Anyone can get admin access', 'Manage admin roles in database only', 'Register with admin-containing email'],
        ['SEC-013', 'Low', 'Abuse Prevention', 'CWE-799', 'Confirmed', 'server/index.js', 'POST /api/send-otp', 'No rate limiting on OTP endpoint', 'Email spam and quota exhaustion', 'Add express-rate-limit', 'Call endpoint rapidly'],
        ['SEC-014', 'Low', 'Abuse Prevention', 'CWE-799', 'Confirmed', 'server/index.js', 'POST /api/scrape', 'No rate limiting on scrape endpoint', 'Server abuse as scraping proxy', 'Add express-rate-limit', 'Call endpoint rapidly'],
        ['SEC-015', 'Low', 'Secrets Management', 'CWE-200', 'Confirmed', '.env', 'N/A', 'Firebase credentials in .env file', 'Firebase config exposed if .env tracked', 'Verify .env is gitignored, use App Check', 'git ls-files .env'],
        ['SEC-016', 'Informational', 'Development Residue', 'CWE-1188', 'Confirmed', 'src/context/AuthContext.tsx', 'Login', 'Mock mode stores plaintext credentials and auto-registers users', 'Any credentials work in mock mode', 'Disable mock mode in production builds', 'Login without Supabase configured'],
        ['SEC-017', 'Informational', 'Logging', 'CWE-532', 'Confirmed', 'server/index.js', 'POST /api/send-otp', 'Email addresses logged to server console', 'PII in logs', 'Use structured logger with PII redaction', 'Review console output']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(findings), 'Security Findings');

    // Sheet 2: Endpoint Inventory
    const endpoints = [
        ['Endpoint', 'HTTP Method', 'Authentication', 'Authorization', 'Role', 'File Path', 'Parameters', 'Response', 'Rate Limiting', 'Notes'],
        ['POST /api/send-otp', 'POST', 'None', 'None', 'Any', 'server/index.js:26', 'to_email, to_name, otp_code', '200: success / 500: error', 'None', 'OTP relay — server does not generate or verify OTP'],
        ['POST /api/scrape', 'POST', 'None', 'None', 'Any', 'server/index.js:58', 'url', '200: {title,price,image,description} / 500: error', 'None', 'Fetches arbitrary user-supplied URL via Axios — SSRF risk']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(endpoints), 'Endpoint Inventory');

    // Sheet 3: Dependency Vulnerabilities
    const deps = [
        ['Package', 'Version', 'Severity', 'CVE/Advisory', 'Scanner', 'Status', 'Recommendation'],
        ['deepmerge-ts', '< 8.0.0', 'High', 'GHSA-ggr8-5vv4-36mx', 'npm audit', 'Open', 'Update webdriverio (breaking)'],
        ['extract-zip', '*', 'High', 'GHSA-jmr9-qjv8-65gv', 'npm audit', 'Open', 'npm audit fix'],
        ['@puppeteer/browsers', '<= 2.13.2', 'High', 'Transitive (extract-zip)', 'npm audit', 'Open', 'npm audit fix'],
        ['@wdio/utils', '>= 8.15.0', 'High', 'Transitive (deepmerge-ts)', 'npm audit', 'Open', 'Update webdriverio'],
        ['@wdio/config', '>= 8.0.0-alpha.213', 'High', 'Transitive', 'npm audit', 'Open', 'Update webdriverio'],
        ['webdriver', '>= 8.0.0-alpha.213', 'High', 'Transitive', 'npm audit', 'Open', 'Update webdriverio'],
        ['webdriverio', '>= 8.0.0-alpha.213', 'High', 'Transitive', 'npm audit', 'Open', 'Downgrade to 7.40.0 or move to devDependencies'],
        ['react-router', '6.0.0–7.17.0', 'Moderate', 'GHSA-wrjc-x8rr-h8h6', 'npm audit', 'Open', 'Upgrade react-router-dom to 7.18.2+ (breaking)'],
        ['react-router', '6.0.0–7.17.0', 'Moderate', 'GHSA-337j-9hxr-rhxg', 'npm audit', 'Open', 'Upgrade react-router-dom to 7.18.2+ (breaking)']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(deps), 'Dependency Vulnerabilities');

    // Sheet 4: Risk Summary
    const risk = [
        ['Severity', 'Count', 'Risk Level', 'Priority'],
        ['Critical', 2, 'Immediate', 'P0'],
        ['High', 5, 'Urgent', 'P1'],
        ['Medium', 5, 'Important', 'P2'],
        ['Low', 3, 'Moderate', 'P3'],
        ['Informational', 2, 'Advisory', 'P4'],
        ['Total', 17, '', '']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(risk), 'Risk Summary');

    XLSX.writeFile(wb, '../Vulnerability Test Results/findings.xlsx');
    console.log('findings.xlsx created.');
}

function createEndpointWorkbook() {
    const wb = XLSX.utils.book_new();

    // Same 4 sheets for endpoint-inventory.xlsx
    const findings = [
        ['Finding ID', 'Severity', 'Category', 'CWE', 'Status', 'File', 'Endpoint', 'Description', 'Impact', 'Recommended Fix', 'Verification'],
        ['SEC-001', 'Critical', 'Secrets Management', 'CWE-798', 'Confirmed', 'server/.env', 'N/A', 'SMTP credentials potentially committed to repo', 'Credential exposure', 'Add to .gitignore, rotate', 'git ls-files server/.env'],
        ['SEC-002', 'Critical', 'Secrets Management', 'CWE-798', 'Confirmed', 'src/supabaseClient.js', 'N/A', 'Hardcoded Supabase credentials', 'DB access in bundle', 'Use env vars', 'grep supabase.co src/'],
        ['SEC-003', 'High', 'Authentication', 'CWE-330', 'Confirmed', 'src/context/AuthContext.tsx', 'Registration', 'Client-side OTP with Math.random()', 'Predictable OTP', 'Server-side crypto.randomInt()', 'Inspect signUp()'],
        ['SEC-004', 'High', 'Authentication', 'CWE-312', 'Confirmed', 'src/context/AuthContext.tsx', 'Registration', 'Plaintext password in localStorage', 'XSS password theft', 'Never store passwords client-side', 'Check localStorage'],
        ['SEC-005', 'High', 'Authorization', 'CWE-269', 'Potential', 'supabase_schema.sql', 'profiles', 'Users can UPDATE own role', 'Privilege escalation', 'Split RLS policies', 'Test role update'],
        ['SEC-006', 'High', 'SSRF', 'CWE-918', 'Confirmed', 'server/index.js', 'POST /api/scrape', 'Unrestricted URL fetching', 'Internal network access', 'Domain allowlist, IP blocking', 'Code review'],
        ['SEC-007', 'High', 'Authentication', 'CWE-306', 'Confirmed', 'server/index.js', 'All', 'No auth on endpoints', 'Open abuse', 'JWT verification middleware', 'Call without token']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(findings), 'Security Findings');

    const endpoints = [
        ['Endpoint', 'HTTP Method', 'Authentication', 'Authorization', 'Role', 'File Path', 'Parameters', 'Response', 'Rate Limiting', 'Notes'],
        ['POST /api/send-otp', 'POST', 'None', 'None', 'Any', 'server/index.js:26', 'to_email, to_name, otp_code', '200/500', 'None', 'OTP email relay'],
        ['POST /api/scrape', 'POST', 'None', 'None', 'Any', 'server/index.js:58', 'url', '200/500', 'None', 'Web scraper — SSRF risk']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(endpoints), 'Endpoint Inventory');

    const deps = [
        ['Package', 'Version', 'Severity', 'CVE/Advisory', 'Scanner', 'Status', 'Recommendation'],
        ['deepmerge-ts', '< 8.0.0', 'High', 'GHSA-ggr8-5vv4-36mx', 'npm audit', 'Open', 'Update webdriverio'],
        ['extract-zip', '*', 'High', 'GHSA-jmr9-qjv8-65gv', 'npm audit', 'Open', 'npm audit fix'],
        ['react-router', '6.x–7.17', 'Moderate', 'GHSA-wrjc-x8rr-h8h6', 'npm audit', 'Open', 'Upgrade to 7.18.2+']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(deps), 'Dependency Vulnerabilities');

    const risk = [
        ['Severity', 'Count', 'Risk Level', 'Priority'],
        ['Critical', 2, 'Immediate', 'P0'],
        ['High', 5, 'Urgent', 'P1'],
        ['Medium', 5, 'Important', 'P2'],
        ['Low', 3, 'Moderate', 'P3'],
        ['Informational', 2, 'Advisory', 'P4'],
        ['Total', 17, '', '']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(risk), 'Risk Summary');

    XLSX.writeFile(wb, '../Vulnerability Test Results/endpoint-inventory.xlsx');
    console.log('endpoint-inventory.xlsx created.');
}

createFindingsWorkbook();
createEndpointWorkbook();
console.log('All Excel files generated.');
