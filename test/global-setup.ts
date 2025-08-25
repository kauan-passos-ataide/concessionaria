import { writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

export default async function globalSetup() {
  const CONTAINER_NAME = 'postgres-e2e';

  const pg: StartedPostgreSqlContainer = await new PostgreSqlContainer(
    'postgres:15',
  )
    .withDatabase('test_db')
    .withUsername('test')
    .withPassword('test')
    .withReuse()
    .withName(CONTAINER_NAME)
    .start();

  const databaseUrl = `postgresql://${pg.getUsername()}:${pg.getPassword()}@${pg.getHost()}:${pg.getPort()}/${pg.getDatabase()}?schema=public`;

  const envFile = join(process.cwd(), 'test', '.env.testcontainers');
  writeFileSync(
    envFile,
    `DATABASE_URL=${databaseUrl}\nCONTAINER_ID=${pg.getId()}\n`,
    'utf8',
  );

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}
