#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[32m%s\x1b[0m', ' 💵 Starting CloudPrune Full Stack in Dev Mode');
console.log('\x1b[36m%s\x1b[0m', '=====================================================');

const backend = spawn('npm', ['run', 'dev'], {
  cwd: backendDir,
  shell: true,
  stdio: 'pipe'
});

const frontend = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'pipe'
});

const formatLog = (prefix, color, data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      console.log(`${color}[${prefix}]\x1b[0m ${line}`);
    }
  });
};

backend.stdout.on('data', (data) => formatLog('Backend', '\x1b[34m', data));
backend.stderr.on('data', (data) => formatLog('Backend Error', '\x1b[31m', data));

frontend.stdout.on('data', (data) => formatLog('Frontend', '\x1b[35m', data));
frontend.stderr.on('data', (data) => formatLog('Frontend Error', '\x1b[31m', data));

const cleanup = () => {
  console.log('\n\x1b[33m%s\x1b[0m', 'Shutting down CloudPrune processes...');
  try { backend.kill('SIGINT'); } catch (e) {}
  try { frontend.kill('SIGINT'); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGINT', cleanup);
