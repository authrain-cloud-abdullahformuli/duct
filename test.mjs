import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

console.log('Running test suite for duct...');

// 1. Prohibited files check
const prohibited = [
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'CONTRIBUTOR-PLAYBOOK.md',
  'CONTRIBUTORS.md'
];
for (const file of prohibited) {
  if (fs.existsSync(path.join(root, file))) {
    throw new Error(`Prohibited file exists: ${file}`);
  }
}
console.log('✔ Prohibited files check passed');

// 2. LICENSE check
const license = fs.readFileSync(path.join(root, 'LICENSE'), 'utf8');
if (!license.includes('Copyright (c) 2026 Abdullah Formuli')) {
  throw new Error('LICENSE missing copyright notice for Abdullah Formuli');
}
console.log('✔ LICENSE copyright check passed');

// 3. MAINTAINERS.md check
const maintainers = fs.readFileSync(path.join(root, 'MAINTAINERS.md'), 'utf8');
if (!maintainers.includes('Maintained solely by Abdullah Formuli. No external contributions accepted.')) {
  throw new Error('MAINTAINERS.md missing required sole maintainer notice');
}
console.log('✔ MAINTAINERS.md check passed');

// 4. README.md check
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
if (!readme.includes('Maintained solely by Abdullah Formuli. No external contributions accepted.')) {
  throw new Error('README.md missing required sole maintainer notice');
}
if (readme.includes('5hirish/duct')) {
  throw new Error('README.md contains upstream repository links');
}
if (!readme.includes('authrain-cloud-abdullahformuli/duct')) {
  throw new Error('README.md missing canonical repository reference');
}
console.log('✔ README.md check passed');

// 5. CITATION.cff check
const citation = fs.readFileSync(path.join(root, 'CITATION.cff'), 'utf8');
if (!citation.includes('Formuli') || !citation.includes('Abdullah')) {
  throw new Error('CITATION.cff missing author name');
}
if (!citation.includes('authrain-cloud-abdullahformuli/duct')) {
  throw new Error('CITATION.cff missing canonical repo URL');
}
console.log('✔ CITATION.cff check passed');

// 6. package.json check
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== '@authrain/duct') {
  throw new Error(`Unexpected package name: ${pkg.name}`);
}
if (!pkg.author || !pkg.author.includes('Abdullah Formuli')) {
  throw new Error('package.json missing author');
}
console.log('✔ Root package.json check passed');

// 7. Sub-package check
const subPkgs = [
  'app/package.json',
  'cli/package.json',
  'desktop/package.json',
  'design/motion/package.json',
  'site/package.json'
];
for (const sp of subPkgs) {
  if (!fs.existsSync(path.join(root, sp))) {
    throw new Error(`Missing sub-package: ${sp}`);
  }
}
console.log('✔ All sub-packages verified');

// 8. Demo video check
if (!fs.existsSync(path.join(root, 'site/assets/media/demo.mp4'))) {
  throw new Error('site/assets/media/demo.mp4 missing');
}
console.log('✔ Demo video verified');

// 9. Upstream string check
function checkDirForUpstream(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'test.mjs') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirForUpstream(full);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.js') || entry.name.endsWith('.json') || entry.name.endsWith('.html') || entry.name.endsWith('.py') || entry.name.endsWith('.rs'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('5hirish/duct')) {
        throw new Error(`Upstream repo link found in: ${full}`);
      }
    }
  }
}
checkDirForUpstream(root);
console.log('✔ Upstream link audit passed');

console.log('--- ALL TESTS PASSED ---');
