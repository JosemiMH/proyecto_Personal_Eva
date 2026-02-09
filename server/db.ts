import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

neonConfig.webSocketConstructor = ws;

let pool: Pool;
let db: ReturnType<typeof drizzle>;

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL not set - database features will be limited');
  console.warn('⚠️ Sessions will use memory store');
  // Create a dummy pool that won't be used
  pool = new Pool({ connectionString: 'postgresql://dummy:dummy@localhost:5432/dummy' });
  db = drizzle({ client: pool, schema });
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };