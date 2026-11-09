import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import userRoutes from './src/routes/user.routes.js';
import salonRoutes from './src/routes/salon.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB, query, pool } from './src/config/db.js'
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json())

app.use((req, _res, next) => {
    req.db = pool;
    next();
  });


const PORT = 3000;

app.get('/health', async (req, res) => {
  const { rows } = await query('SELECT NOW() AS now');
  res.json({ ok: true, db: rows[0].now });
});

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/salons', salonRoutes)

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

async function start() {
  await connectDB();  
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
