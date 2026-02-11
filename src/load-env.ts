import * as dotenv from 'dotenv';
dotenv.config();
// Forzamos el DATABASE_URL si no se cargó correctamente desde el .env
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://postgres.vxmwdxxpotwobvkbdahe:Proyect60253405@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
}
console.log('Environment loaded. DATABASE_URL present:', !!process.env.DATABASE_URL);
