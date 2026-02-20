import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const requiredDbVars = ['DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST', 'DB_PORT'];
const missingDbVars = requiredDbVars.filter((key) => !process.env[key]);

if (!process.env.DATABASE_URL && missingDbVars.length > 0) {
  throw new Error(
    `Missing required database environment variables: ${missingDbVars.join(', ')}. ` +
      'Set DATABASE_URL or provide DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT in backend/.env.'
  );
}

const useDatabaseUrl = Boolean(process.env.DATABASE_URL);
const sslOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};

export default {
  development: useDatabaseUrl
    ? {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        logging: false,
        dialectOptions: sslOptions
      }
    : {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false
      },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    native: false,
    logging: false,
    pool: {
      max: 3,
      min: 0,
      acquire: 60000,
      idle: 30000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      keepAlive: true,
      connectTimeout: 60000
    },
    retry: {
      max: 3,
      timeout: 5000
    }
  }
  
};
