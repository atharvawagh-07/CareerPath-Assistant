import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

const DATA_DIR = path.resolve(process.cwd(), 'data/postgres');

let pool: pg.Pool | null = null;
let pgliteInstance: PGlite | null = null;
let initPromise: Promise<void> | null = null;

async function setupDatabase(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl && !databaseUrl.includes('user:password@localhost')) {
    try {
      console.log('[Database] Initializing external PostgreSQL pool...');
      pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' && !databaseUrl.includes('localhost')
          ? { rejectUnauthorized: false }
          : undefined,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      });

      // Test connection
      const client = await pool.connect();
      try {
        await initSchemaExternal(client);
      } finally {
        client.release();
      }
      console.log('[Database] Connected to external PostgreSQL successfully.');
      return;
    } catch (err) {
      console.warn('[Database] Failed to connect to external PostgreSQL, falling back to embedded PGlite:', err);
      pool = null;
    }
  }

  // Fallback to embedded PGlite
  console.log('[Database] Initializing embedded PGlite engine at', DATA_DIR);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  pgliteInstance = new PGlite(DATA_DIR);
  await pgliteInstance.waitReady;
  await initSchemaPGlite(pgliteInstance);
  console.log('[Database] Embedded PGlite ready.');
}

async function initSchemaExternal(client: pg.PoolClient) {
  const schemaPath = path.resolve(process.cwd(), 'server/src/db/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(sql);
  }
}

async function initSchemaPGlite(db: PGlite) {
  const schemaPath = path.resolve(process.cwd(), 'server/src/db/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, 'utf-8');
    await db.exec(sql);
  }
}

export async function ensureDbReady(): Promise<void> {
  if (!initPromise) {
    initPromise = setupDatabase().then(async () => {
      // Check if seeding is required (e.g. fresh database)
      try {
        let hasData = false;
        if (pool) {
          const res = await pool.query('SELECT id FROM careers LIMIT 1');
          hasData = res.rows.length > 0;
        } else if (pgliteInstance) {
          const res = await pgliteInstance.query('SELECT id FROM careers LIMIT 1');
          hasData = res.rows.length > 0;
        }

        if (!hasData) {
          console.log('[Database] Careers table is empty. Running initial seeder...');
          const { runSeed } = await import('./seed.ts');
          await runSeed();
        }
      } catch (seedErr) {
        console.warn('[Database] Auto-seeding check notice:', seedErr);
      }
    });
  }
  return initPromise;
}

export async function getDb(): Promise<PGlite | pg.Pool> {
  await ensureDbReady();
  if (pool) return pool;
  if (pgliteInstance) return pgliteInstance;
  throw new Error('Database not initialized');
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  await ensureDbReady();
  if (pool) {
    const res = await pool.query(sql, params);
    return res.rows as T[];
  }
  if (pgliteInstance) {
    const res = await pgliteInstance.query(sql, params);
    return res.rows as T[];
  }
  throw new Error('Database client unavailable');
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, params: any[] = []): Promise<void> {
  await ensureDbReady();
  if (pool) {
    await pool.query(sql, params);
    return;
  }
  if (pgliteInstance) {
    await pgliteInstance.query(sql, params);
    return;
  }
  throw new Error('Database client unavailable');
}
