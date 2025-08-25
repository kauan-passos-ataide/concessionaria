import { rmSync } from 'fs';
import { join } from 'path';

export default function globalTeardown() {
  const envFile = join(process.cwd(), 'test', '.env.testcontainers');
  rmSync(envFile, { force: true });
}
