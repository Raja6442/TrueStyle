# TrueStyle — Setup & Security Review Guide

## Project Architecture

| Component | Technology |
|---|---|
| Frontend | React 18.3.1 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express (REST API) |
| Database | Supabase PostgreSQL + Firebase Firestore |
| Authentication | Supabase Auth |
| Authorization | Supabase RLS + Firebase Security Rules |
| Storage | Firebase Storage |
| Email | Nodemailer (Gmail SMTP) + EmailJS |
| Deployment | Netlify |

## Prerequisites

- Node.js 18+ (check with `node --version`)
- npm (bundled with Node.js)
- Git

## Installing Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd server
npm install
```

## Running TrueStyle Locally

### Start both frontend and backend
```bash
npm run dev
```
This runs `concurrently "vite" "node server/index.js"` — the frontend on port 5173 and the backend on port 5000.

### Start frontend only
```bash
npx vite
```

### Start backend only
```bash
node server/index.js
```

## Environment Variables

### Frontend (`.env`)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Backend (`server/.env`)
```
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password
PORT=5000
```

**Never commit `.env` files to version control.**

## Running Security Checks

### npm audit
```bash
npm audit
```

### Helper scripts (require Python 3)
```bash
python security/scripts/detect-stack.py
python security/scripts/check-dependencies.py
python security/scripts/generate-summary.py
```

### Optional security tools
```bash
# Semgrep (install: pip install semgrep)
semgrep --config auto .

# Gitleaks (install: https://github.com/gitleaks/gitleaks)
gitleaks detect --source .

# Trivy (install: https://github.com/aquasecurity/trivy)
trivy fs .
```

## Where Reports Are Stored

All reports are in the `Vulnerability Test Results/` directory:

| File | Contents |
|---|---|
| `security-review.md` | Detailed findings with evidence |
| `executive-summary.md` | High-level summary and score |
| `dependency-report.md` | npm audit and scanner results |
| `remediation.md` | Fix recommendations with code examples |
| `backend-inventory.md` | Technology stack documentation |
| `api-inventory.md` | API endpoint documentation |
| `supabase-security-review.md` | RLS policy analysis |
| `dast-report.md` | Dynamic testing status |
| `findings.xlsx` | All findings in Excel format |
| `endpoint-inventory.xlsx` | Endpoint inventory in Excel format |

## GitHub Actions

The `.github/workflows/security-review.yml` workflow runs on push, pull_request, and manual dispatch. It performs:

1. Frontend and backend dependency installation
2. Lint and test execution (if configured)
3. npm audit
4. Semgrep, Gitleaks, Trivy (if available)
5. Report upload as GitHub Actions artifacts

### Configuring GitHub Secrets

1. Go to your repository → Settings → Secrets and variables → Actions.
2. Add secrets (never hardcode them in workflow files):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
3. Reference in workflows: `${{ secrets.SUPABASE_URL }}`

## Remediating Critical Findings

See `Vulnerability Test Results/remediation.md` for detailed fix instructions, prioritized:

1. **Rotate SMTP credentials** and fix `.gitignore`
2. **Move OTP to server-side** with `crypto.randomInt()`
3. **Add JWT authentication** to backend endpoints
4. **Add SSRF protection** to `/api/scrape`
5. **Fix RLS policies** to prevent privilege escalation
