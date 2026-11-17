import { execFileSync } from 'node:child_process';

// Fails on high or critical advisories in production dependencies, except the
// documented exceptions below. Each exception expires so it gets reviewed again.
const exceptions = [
  {
    id: 'GHSA-fc5q-39xc-vjpf',
    reviewBy: '2027-02-17',
    reason: 'picomatch ReDoS without a patched release. It arrives through next-intl -> @parcel/watcher, used only by the message extractor, which this site does not enable. The patterns are written by developers, not visitors.',
  },
];

const today = new Date().toISOString().slice(0, 10);
// Run npm's own CLI through Node when started with `npm run`, so no shell is involved.
const [command, args] = process.env.npm_execpath
  ? [process.execPath, [process.env.npm_execpath]]
  : ['npm', []];
let output;
try {
  output = execFileSync(command, [...args, 'audit', '--omit=dev', '--json'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (error) {
  // npm audit exits with 1 when it finds vulnerabilities; the JSON is still on stdout.
  output = error.stdout;
  if (!output) throw error;
}

const report = JSON.parse(output);
if (report.error) throw new Error(`npm audit failed: ${report.error.summary || report.error.code}`);

const advisories = new Map();
for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via) {
    if (typeof via === 'string' || !['high', 'critical'].includes(via.severity)) continue;
    const id = via.url?.split('/').pop() ?? String(via.source);
    advisories.set(id, `${via.name}: ${via.title} (${via.severity}) ${via.url}`);
  }
}

const problems = [];
for (const [id, description] of advisories) {
  const exception = exceptions.find((entry) => entry.id === id);
  if (!exception) problems.push(`Not allowed: ${description}`);
  else if (exception.reviewBy < today) problems.push(`Exception expired on ${exception.reviewBy}, review it: ${description}`);
  else console.log(`Allowed until ${exception.reviewBy}: ${description}`);
}
for (const exception of exceptions) {
  if (!advisories.has(exception.id)) console.log(`${exception.id} no longer appears; remove its exception.`);
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('Production audit passed: no high or critical advisories outside the documented exceptions.');
