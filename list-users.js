const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({
        connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        const res = await client.query("SELECT id, nombre, email, documento, contrasena FROM users ORDER BY id DESC");
        console.log('--- ALL_USERS ---');
        res.rows.forEach(row => {
            console.log(`ID: ${row.id} | Name: [${row.nombre}] | DNI: [${row.documento}] | EMAIL: [${row.email}] | PASS: [${row.contrasena}]`);
        });

        const countRes = await client.query('SELECT COUNT(*) FROM users');
        console.log(`TOTAL_USERS: ${countRes.rows[0].count}`);
        console.log('--- END_USERS ---');
    } catch (err) {
        console.error('Error connecting to DB:', err.message);
    } finally {
        await client.end();
    }
}

main();
