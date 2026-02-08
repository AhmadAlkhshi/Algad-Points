import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import studentsRoutes from './routes/students.js';
import gamesRoutes from './routes/games.js';
import purchasesRoutes from './routes/purchases.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'PointsMarket API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
