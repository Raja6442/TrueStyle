/**
 * ═══════════════════════════════════════════════════════════════════
 *  TrueStyle Baseline Load Test — Standalone Node.js Script
 * ═══════════════════════════════════════════════════════════════════
 *
 *  WHAT THIS DOES:
 *    Simulates 100 concurrent virtual users hitting your backend
 *    continuously for 1 minute. Reports RPS, response times, errors.
 *
 *  SAFETY:
 *    - /api/send-otp receives INCOMPLETE payloads → 400, no emails sent
 *    - /api/scrape receives EMPTY body → 400, no URLs fetched
 *
 *  RUN:
 *    1. Start your backend:  node server/index.js
 *    2. Run this script:     node load-tests/baseline-standalone.cjs
 *
 * ═══════════════════════════════════════════════════════════════════
 */

const http = require('http');

// ── Configuration ──────────────────────────────────────────────────
const TARGET_HOST = 'localhost';
const TARGET_PORT = 5000;
const VIRTUAL_USERS = 100;
const DURATION_SEC = 60;

// ── Metrics ────────────────────────────────────────────────────────
let totalRequests = 0;
let successCount = 0;
let errorCount = 0;
let responseTimes = [];
let statusCodes = {};
let startTime;

// ── Test Scenarios (weighted) ──────────────────────────────────────
const scenarios = [
  {
    name: 'POST /api/send-otp (validation 400)',
    weight: 50,
    options: {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path: '/api/send-otp',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    body: JSON.stringify({ to_name: 'LoadTestUser' }) // Missing to_email & otp_code → 400
  },
  {
    name: 'POST /api/scrape (validation 400)',
    weight: 50,
    options: {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path: '/api/scrape',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    body: JSON.stringify({}) // Missing url → 400
  }
];

// ── Pick a random scenario based on weight ─────────────────────────
function pickScenario() {
  const totalWeight = scenarios.reduce((sum, s) => sum + s.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const s of scenarios) {
    rand -= s.weight;
    if (rand <= 0) return s;
  }
  return scenarios[0];
}

// ── Send a single request ──────────────────────────────────────────
function sendRequest() {
  return new Promise((resolve) => {
    const scenario = pickScenario();
    const reqStart = Date.now();

    const req = http.request(scenario.options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const elapsed = Date.now() - reqStart;
        totalRequests++;
        responseTimes.push(elapsed);
        statusCodes[res.statusCode] = (statusCodes[res.statusCode] || 0) + 1;

        if (res.statusCode < 500) {
          successCount++;
        } else {
          errorCount++;
        }
        resolve(elapsed);
      });
    });

    req.on('error', (err) => {
      totalRequests++;
      errorCount++;
      resolve(-1);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      totalRequests++;
      errorCount++;
      resolve(-1);
    });

    req.write(scenario.body);
    req.end();
  });
}

// ── Virtual User Loop ──────────────────────────────────────────────
async function virtualUser(userId) {
  const endTime = startTime + (DURATION_SEC * 1000);

  while (Date.now() < endTime) {
    await sendRequest();
    // Small random delay between requests (10-50ms) to simulate real users
    await new Promise(r => setTimeout(r, Math.random() * 40 + 10));
  }
}

// ── Progress Reporter ──────────────────────────────────────────────
function reportProgress() {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const rps = (totalRequests / Math.max(1, elapsed)).toFixed(1);
  const avgMs = responseTimes.length > 0
    ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(0)
    : 0;

  process.stdout.write(
    `\r  ⏱  ${elapsed}s | Requests: ${totalRequests} | RPS: ${rps} | ` +
    `Avg: ${avgMs}ms | Errors: ${errorCount}  `
  );
}

// ── Percentile Calculator ──────────────────────────────────────────
function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

// ── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  TrueStyle Baseline Load Test');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Target:          http://${TARGET_HOST}:${TARGET_PORT}`);
  console.log(`  Virtual Users:   ${VIRTUAL_USERS}`);
  console.log(`  Duration:        ${DURATION_SEC} seconds`);
  console.log(`  Scenarios:       ${scenarios.map(s => s.name).join(', ')}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Verify server is reachable
  console.log('  🔌 Checking server connectivity...');
  try {
    await sendRequest();
    totalRequests = 0; successCount = 0; errorCount = 0; responseTimes = []; statusCodes = {};
    console.log('  ✅ Server is reachable!\n');
  } catch (e) {
    console.error('  ❌ Cannot reach server. Start it with: node server/index.js');
    process.exit(1);
  }

  console.log(`  🚀 Launching ${VIRTUAL_USERS} virtual users for ${DURATION_SEC}s...\n`);

  startTime = Date.now();

  // Progress reporting every second
  const progressInterval = setInterval(reportProgress, 1000);

  // Launch all virtual users concurrently
  const users = [];
  for (let i = 0; i < VIRTUAL_USERS; i++) {
    users.push(virtualUser(i));
    // Stagger user starts slightly (0-500ms) to avoid thundering herd
    await new Promise(r => setTimeout(r, Math.random() * 5));
  }

  // Wait for all users to finish
  await Promise.all(users);
  clearInterval(progressInterval);

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  // ── Final Report ───────────────────────────────────────────────
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  📊 LOAD TEST RESULTS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log(`  Duration:              ${totalElapsed}s`);
  console.log(`  Virtual Users:         ${VIRTUAL_USERS}`);
  console.log(`  Total Requests:        ${totalRequests}`);
  console.log(`  Successful (non-5xx):  ${successCount}`);
  console.log(`  Errors (5xx/timeout):  ${errorCount}`);
  console.log('');
  console.log('  ── Throughput ──────────────────────────────────────────');
  console.log(`  Requests/sec (RPS):    ${(totalRequests / parseFloat(totalElapsed)).toFixed(1)}`);
  console.log('');
  console.log('  ── Response Times ─────────────────────────────────────');

  if (responseTimes.length > 0) {
    const sorted = [...responseTimes].sort((a, b) => a - b);
    const avg = (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = percentile(responseTimes, 50);
    const p95 = percentile(responseTimes, 95);
    const p99 = percentile(responseTimes, 99);

    console.log(`  Min:                   ${min}ms`);
    console.log(`  Average:               ${avg}ms`);
    console.log(`  Median (p50):          ${median}ms`);
    console.log(`  p95:                   ${p95}ms`);
    console.log(`  p99:                   ${p99}ms`);
    console.log(`  Max:                   ${max}ms`);
  }

  console.log('');
  console.log('  ── Status Code Distribution ────────────────────────────');
  for (const [code, count] of Object.entries(statusCodes).sort()) {
    const pct = ((count / totalRequests) * 100).toFixed(1);
    console.log(`  HTTP ${code}:              ${count} (${pct}%)`);
  }

  console.log('');
  console.log('  ── Error Rate ─────────────────────────────────────────');
  const errorRate = ((errorCount / totalRequests) * 100).toFixed(2);
  console.log(`  Error Rate:            ${errorRate}%`);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');

  // ── Pass/Fail Assessment ────────────────────────────────────────
  const avgTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;
  const rps = totalRequests / parseFloat(totalElapsed);

  console.log('');
  console.log('  ── Assessment ─────────────────────────────────────────');

  if (avgTime < 100)       console.log('  ⚡ Response Time:      EXCELLENT (< 100ms avg)');
  else if (avgTime < 250)  console.log('  ✅ Response Time:      GOOD (< 250ms avg)');
  else if (avgTime < 500)  console.log('  ⚠️  Response Time:      ACCEPTABLE (< 500ms avg)');
  else if (avgTime < 1500) console.log('  🔶 Response Time:      SLOW (< 1500ms avg)');
  else                     console.log('  ❌ Response Time:      CRITICAL (> 1500ms avg)');

  if (parseFloat(errorRate) < 1)       console.log('  ✅ Error Rate:         EXCELLENT (< 1%)');
  else if (parseFloat(errorRate) < 5)  console.log('  ⚠️  Error Rate:         ACCEPTABLE (< 5%)');
  else                                 console.log('  ❌ Error Rate:         HIGH (> 5%)');

  if (rps > 500)       console.log('  ⚡ Throughput:         EXCELLENT (> 500 RPS)');
  else if (rps > 100)  console.log('  ✅ Throughput:         GOOD (> 100 RPS)');
  else if (rps > 50)   console.log('  ⚠️  Throughput:         ACCEPTABLE (> 50 RPS)');
  else                 console.log('  🔶 Throughput:         LOW (< 50 RPS)');

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
}

main().catch(console.error);
