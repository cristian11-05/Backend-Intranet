const { Client } = require('pg');

const connStr = "postgresql://postgres.zmvnhlnvjzdakczfvlrm:60253405Cris@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true";

const client = new Client({
    connectionString: connStr,
});

async function testConnection() {
    console.log('Testing DIRECT connection to:', connStr.replace(/:[^:@/]+@/, ':****@'));
    try {
        await client.connect();
        console.log('CONNECTED SUCCESSFULLY TO SUPABASE (DIRECT)!');
        const res = await client.query('SELECT NOW() as now');
        console.log('Current time from DB:', res.rows[0].now);
        await client.end();
    } catch (err) {
        console.error('CONNECTION ERROR (DIRECT):', err.message);
    }
}

testConnection();
