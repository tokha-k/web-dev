const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('club cards render an inactive View Details control', () => {
  const scriptPath = path.join(__dirname, 'script.js');
  const scriptSource = fs.readFileSync(scriptPath, 'utf8');

  assert.equal(scriptSource.includes('View Details'), true);
  assert.equal(scriptSource.includes("clubGrid.addEventListener('click'"), false);
});
