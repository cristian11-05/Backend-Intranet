const { Client } = require('pg');

const connStr = "postgresql://postgres.zmvnhlnvjzdakczfvlrm:60253405Cris@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true";

async function createTable() {
    const client = new Client({ connectionString: connStr });
    try {
        await client.connect();
        console.log('Connected to DB');

        const query = `
            CREATE TABLE IF NOT EXISTS "User" (
                "id" SERIAL PRIMARY KEY,
                "dni" TEXT UNIQUE,
                "email" TEXT UNIQUE NOT NULL,
                "password" TEXT NOT NULL,
                "name" TEXT,
                "role" TEXT NOT NULL DEFAULT 'USER',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL
            );
        `;

        await client.query(query);
        console.log('Table "User" created or already exists');

        // Insert test user
        const insertQuery = `
            INSERT INTO "User" ("dni", "email", "password", "name", "role", "updatedAt")
            VALUES ('12345678', 'admin@admin.com', 'admin123', 'Administrador', 'USER', CURRENT_TIMESTAMP)
            ON CONFLICT ("email") DO NOTHING;
        `;
        await client.query(insertQuery);
        console.log('Test user created (admin@admin.com / admin123)');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

createTable();
