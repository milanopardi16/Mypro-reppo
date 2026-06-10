const fs = require('fs');
const path = require('path');

const requiredFiles = [
  '.env.example',
  'railway.json',
  'Dockerfile',
  'package.json',
  'DEPLOYMENT_READY.md',
];

function validateFile(fileName) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing required file: ${fileName}`);
    return false;
  }
  console.log(`Found: ${fileName}`);
  return true;
}

function run() {
  console.log('# Predeploy checklist');
  let allPresent = true;

  requiredFiles.forEach((fileName) => {
    if (!validateFile(fileName)) {
      allPresent = false;
    }
  });

  if (!allPresent) {
    console.error('Predeploy check failed. Verify required repository files exist.');
    process.exit(1);
  }

  console.log('Predeploy check passed. All required files are present.');
  process.exit(0);
}

run();
