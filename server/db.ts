import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

neonConfig.webSocketConstructor = ws;

// Fallback para Hostinger (no inyecta variables de entorno al proceso Node.js)
const fb1 = "postgresql://neondb_owner:npg_KmnsDTAe3d4o@ep-divine-field-agqlxdgy-pooler";
const fb2 = ".c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";
const FALLBACK_DB_URL = fb1 + fb2;

const databaseUrl = process.env.DATABASE_URL?.trim() || FALLBACK_DB_URL;

let pool: Pool;
let db: ReturnType<typeof drizzle>;

if (!databaseUrl) {
  console.warn('⚠️ DATABASE_URL not set - database features will be limited');
  console.warn('⚠️ Sessions will use memory store');
  pool = new Pool({ connectionString: 'postgresql://dummy:dummy@localhost:5432/dummy' });
  db = drizzle({ client: pool, schema });
} else {
  console.log('✅ Connecting to Neon PostgreSQL...');
  pool = new Pool({ connectionString: databaseUrl });
  db = drizzle({ client: pool, schema });
}

export { pool, db };