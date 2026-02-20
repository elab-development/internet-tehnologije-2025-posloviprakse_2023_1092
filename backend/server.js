import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });


console.log(' DEBUG STARTUP');
console.log('NODE_ENV:', `"${process.env.NODE_ENV}"`);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET ✓' : 'MISSING ');
if (process.env.DATABASE_URL) {
  const masked = process.env.DATABASE_URL.replace(/:[^:]*@/, ':***@');
  console.log('DB URL:', masked);
}
console.log(' END DEBUG\n');

import db from './models/index.js';
import { seedDatabase } from './migrations/seed.js';


import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;


const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://poslovi.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));


app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);


app.get('/api/health', async (req, res) => {
  try {
    
    await db.sequelize.authenticate();
    
    res.json({
      success: true,
      message: 'Backend je pokrenut i spreman!',
      database: 'CONNECTED',
      backend: 'CONNECTED',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Backend je pokrenut ali baza nije dostupna',
      database: 'DISCONNECTED',
      backend: 'CONNECTED',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta nije pronađena.'
  });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Došlo je do greške na serveru.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


app.listen(PORT, () => {
  console.log(`Backend server pokrenut na http://localhost:${PORT}`);
  console.log(`Okruženje: ${process.env.NODE_ENV || 'development'}`);
});


const initDatabase = async () => {
  try {
    
    const dbUrl = process.env.DATABASE_URL || 'Not set';
    const maskedUrl = dbUrl.replace(/:[^:]*@/, ':***@');
    console.log(' Pokušaj konekcije na:', maskedUrl);
    
    console.log(' Authenticating database...');
    await db.sequelize.authenticate();
    console.log(' Database authenticated successfully!');
    
    console.log(' Syncing database schema...');
    await db.sequelize.sync({ alter: true });
    console.log(' Baza je sinhronizovana!');

    
    console.log(' Seeding database with test data...');
    await seedDatabase();
    console.log(' Database seeded successfully!');
  } catch (error) {
    console.error(' Greška pri konekciji na bazu:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.sql) console.error('SQL:', error.sql);
    console.error('Stack:', error.stack);
    console.error('Full object:', JSON.stringify(error, null, 2));
  }
};

initDatabase();

export default app;
