import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taxRoutes from './routes/taxRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load .env from the same directory as this file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debug: log whether GEMINI_API_KEY is loaded (hides the actual key)
console.log('GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'YES' : 'NO');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/chat', chatRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('TaxBuddy API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
