const { execSync } = require('child_process');
const fs = require('fs');
try {
  execSync('npx tsc', { encoding: 'utf-8', stdio: 'pipe' });
  console.log('OK');
} catch (e) {
  fs.writeFileSync('ts_errs.txt', e.stdout + '\n' + e.stderr);
  console.log('ERR');
}
