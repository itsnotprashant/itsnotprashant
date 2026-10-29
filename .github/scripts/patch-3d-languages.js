// Small tweak to the language ring of github-profile-3d-contrib (v0.9.3):
//   1. hide the grey "other" slice
//   2. show each language's percentage next to its name
// It edits the tool's built file (dist/index.js) before the tool runs.
const fs = require('fs');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node patch-3d-languages.js <path to dist/index.js>');
  process.exit(1);
}

let code = fs.readFileSync(file, 'utf8');

const changes = [
  {
    // don't add the "other" slice
    from: 'if (0 < otherContributions) {',
    to: 'if (false && 0 < otherContributions) {',
  },
  {
    // "Python" -> "Python 56.3%"
    from: '.text((d) => d.data.language)',
    to: '.text((d) => `${d.data.language} ${((d.data.contributions / sumContrib) * 100).toFixed(1)}%`)',
  },
];

for (const { from, to } of changes) {
  const found = code.split(from).length - 1;
  if (found !== 1) {
    console.error(`Patch failed: expected to find "${from}" once, found ${found}.`);
    process.exit(1);
  }
  code = code.replace(from, () => to);
}

fs.writeFileSync(file, code);
console.log('Language ring patched: percentages shown, "other" hidden.');
