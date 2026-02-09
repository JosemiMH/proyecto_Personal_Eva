import { pool } from './db';

/**
 * Test database connection before starting the server
 * Helps identify connection issues early in the deployment process
 */
export async function testDatabaseConnection(): Promise<boolean> {
    try {
        console.log('Testing database connection...');
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
        client.release();

        console.log('✓ Database connection successful');
        console.log(`  PostgreSQL version: ${result.rows[0].postgres_version.split(',')[0]}`);
        console.log(`  Server time: ${result.rows[0].current_time}`);

        return true;
    } catch (error: any) {
        console.error('✗ Database connection failed');
        console.error(`  Error: ${error.message}`);

        if (error.code === 'ENOTFOUND') {
            console.error('  → Database host not found. Check DATABASE_URL hostname.');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('  → Connection refused. Check if database is running and port is correct.');
        } else if (error.code === '28P01') {
            console.error('  → Authentication failed. Check database username/password.');
        }

        console.error('  DATABASE_URL format should be: postgresql://user:pass@host:port/dbname?sslmode=require');

        return false;
    }
}

/**
 * Validate DATABASE_URL format
 */
export function validateDatabaseUrl(): boolean {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        console.error('❌ DATABASE_URL environment variable is not set');
        return false;
    }

    // Basic validation
    if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
        console.error('❌ DATABASE_URL must start with postgresql:// or postgres://');
        return false;
    }

    console.log('✓ DATABASE_URL format looks valid');
    return true;
}
