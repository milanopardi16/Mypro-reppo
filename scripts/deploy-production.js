const { spawn, execSync } = require('child_process');
const { URL } = require('url');

function normalizeCommand(command) {
  if (process.platform === 'win32' && command === 'railway') {
    return 'railway.cmd';
  }
  return command;
}

function requiresShell(command) {
  return process.platform === 'win32' && command.startsWith('railway');
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const executable = normalizeCommand(command);
    const spawnOptions = { shell: requiresShell(command), stdio: ['ignore', 'pipe', 'pipe'], ...options };

    if (command === 'railway') {
      console.log(`process.platform: ${process.platform}`);
      console.log(`process.env.PATH: ${process.env.PATH}`);
    }

    const child = spawn(executable, args, spawnOptions);
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    child.on('error', (error) => {
      let whereOutput = '';
      if (command === 'railway' && process.platform === 'win32') {
        try {
          whereOutput = execSync('where railway', { shell: true, stdio: 'pipe' }).toString().trim();
        } catch (whereError) {
          whereOutput = whereError.message;
        }
      }
      const message = [`Failed to execute ${executable} ${args.join(' ')}: ${error.message}`];
      if (whereOutput) {
        message.push(`where railway output:\n${whereOutput}`);
      }
      reject(new Error(message.join('\n')));
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed: ${executable} ${args.join(' ')}\nExit code: ${code}\n${stderr.trim()}`));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function verifyCli(name, versionArgs) {
  process.stdout.write(`Checking ${name} availability... `);
  const version = await runCommand(name, versionArgs);
  console.log('OK', version.split('\n')[0]);
}

async function getCurrentBranch() {
  const branch = await runCommand('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  console.log(`Current branch: ${branch}`);
  return branch;
}

async function getRailwayProjectUrl() {
  process.stdout.write('Retrieving Railway project metadata... ');
  try {
    const raw = await runCommand('railway', ['status', '--json']);
    const payload = JSON.parse(raw);
    const url = payload?.project?.domain || payload?.project?.url || payload?.domains?.[0]?.domain || payload?.url;
    if (!url) {
      throw new Error('Railway CLI returned JSON but project URL was not found.');
    }
    console.log('OK', url);
    return url;
  } catch (error) {
    const raw = await runCommand('railway', ['status']);
    const lines = raw.split(/\r?\n/);
    const urlLine = lines.find((line) => /Url|URL|Domain|Project URL/i.test(line));
    if (!urlLine) {
      throw new Error(`Railway status output did not contain a project address.\n${raw}`);
    }
    const [, value] = urlLine.split(':').map((part) => part.trim());
    if (!value) {
      throw new Error(`Railway status line could not be parsed: ${urlLine}`);
    }
    console.log('OK', value);
    return value;
  }
}

async function healthCheck(url) {
  const healthUrl = new URL('/health', url).href;
  process.stdout.write(`Checking health endpoint ${healthUrl}... `);
  const response = await fetch(healthUrl, { method: 'GET', redirect: 'follow' });
  if (response.status !== 200) {
    throw new Error(`Health check failed. Expected status 200, received ${response.status}.`);
  }
  console.log('PASS');
}

async function run() {
  console.log('# =================================');
  console.log('PRODUCTION DEPLOYMENT AUTOMATION');
  console.log('# =================================');
  console.log(`Current PATH: ${process.env.PATH}`);

  await verifyCli('git', ['--version']);
  await verifyCli('railway', ['--version']);

  const branch = await getCurrentBranch();
  if (branch !== 'main') {
    throw new Error(`Deployment must run from the main branch. Current branch is '${branch}'.`);
  }

  console.log('Stage 4: git add, commit, push');
  await runCommand('git', ['add', '.']);

  const diff = await runCommand('git', ['diff', '--cached', '--name-only']);
  if (diff) {
    await runCommand('git', ['commit', '-m', 'Production Ready']);
    console.log('Git commit: OK');
  } else {
    console.log('Git commit: SKIPPED (no staged changes)');
  }

  await runCommand('git', ['push', 'origin', 'main']);
  console.log('Git push: OK');

  console.log('Stage 5: railway up');
  await runCommand('railway', ['up']);
  console.log('Railway deploy: OK');

  const projectUrl = await getRailwayProjectUrl();
  await healthCheck(projectUrl);

  console.log('# =================================');
  console.log('STATUS: PRODUCTION READY');
  console.log('GITHUB: PASS');
  console.log('BUILD: PASS');
  console.log('DEPLOY: PASS');
  console.log('HEALTH CHECK: PASS');
  process.exit(0);
}

run().catch((error) => {
  console.error('# =================================');
  console.error('STATUS: PRODUCTION FAILED');
  console.error(error.message || error);
  console.error(error.stack || '');
  process.exit(1);
});
