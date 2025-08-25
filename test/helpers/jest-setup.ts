import { resetDatabase } from './prisma-reset';

beforeEach(async () => {
  await resetDatabase();
});
