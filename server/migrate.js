import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        console.log('Checking database connection...');
        const client = await pool.connect();
        console.log('✓ Connected.');

        console.log('Adding columns if they do not exist...');
        await client.query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS long_description TEXT;');
        await client.query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_link TEXT;');
        console.log('✓ Migration queries completed.');

        const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects';");
        console.log('Current columns in projects table:', res.rows.map(r => r.column_name).join(', '));

        client.release();
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        process.exit(0);
    }
};

run();
