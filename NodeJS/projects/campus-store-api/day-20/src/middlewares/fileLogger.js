import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const logDirectory = path.resolve(currentDir, '../../logs');
const logFile = path.join(logDirectory, 'requests.log');

export async function fileLogger(req, res, next) {
  try {
    await mkdir(logDirectory, { recursive: true });
    await appendFile(logFile, `${new Date().toISOString()} ${req.method} ${req.originalUrl}\n`);
  } catch (error) {
    console.error('Could not write request log:', error.message);
  }
  next();
}
