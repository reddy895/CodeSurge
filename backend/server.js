import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon_db';

console.log('Connecting to MongoDB database...');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`\n==================================================`);
    console.log(`[SUCCESS] Connected to MongoDB at: ${MONGODB_URI}`);
    console.log(`You can inspect collections in MongoDB Compass.`);
    
    app.listen(PORT, () => {
      console.log(`[SUCCESS] Server listening on port ${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
      console.log(`==================================================\n`);
    });
  })
  .catch((error) => {
    console.error(`\n[ERROR] Database connection failure: ${error.message}`);
    console.error('Please ensure your local MongoDB service is running (e.g. via MongoDB Compass or mongod).\n');
    process.exit(1);
  });
