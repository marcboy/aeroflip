import fs from 'fs';
import path from 'path';

const pkgPath = path.resolve('package.json');
const handoffPath = path.resolve('HANDOFF.md');

// Get current time in US Pacific (Los Angeles)
const now = new Date();
const laTime = now.toLocaleString('en-US', {
  timeZone: 'America/Los_Angeles',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
}).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2'); // Format to YYYY-MM-DD HH:mm:ss

const laTimestamp = `${laTime} PDT`;

// Update package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.latestUpdate = laTimestamp;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// Update HANDOFF.md
if (fs.existsSync(handoffPath)) {
  let handoff = fs.readFileSync(handoffPath, 'utf8');
  handoff = handoff.replace(/- \*\*Timestamp\*\*: .*/, `- **Timestamp**: ${laTimestamp}`);
  fs.writeFileSync(handoffPath, handoff);
}

console.log(`Updated timestamp to: ${laTimestamp}`);
