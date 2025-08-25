import { readFileSync } from 'fs';
import { join } from 'path';

const envFile = join(process.cwd(), 'test', '.env.testcontainers');
const content = readFileSync(envFile, 'utf8');
for (const line of content.split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [k, ...rest] = line.split('=');
  const v = rest.join('=');
  if (k && v && !process.env[k]) process.env[k] = v;
}
