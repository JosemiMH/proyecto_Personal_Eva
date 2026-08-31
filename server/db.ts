import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL?.trim();

let pool: Pool;
let db: ReturnType<typeof drizzle>;

if (!databaseUrl) {
  console.warn('⚠️ DATABASE_URL not set - database features will be limited');
  console.warn('⚠️ Sessions will use memory store');
  pool = new Pool({ connectionString: 'postgresql://localhost:5432/epm_unconfigured' });
  db = drizzle({ client: pool, schema });
} else {
  console.log('✅ Connecting to PostgreSQL...');
  pool = new Pool({ connectionString: databaseUrl });
  db = drizzle({ client: pool, schema });
}

export { pool, db };