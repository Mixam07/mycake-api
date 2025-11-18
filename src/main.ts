import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './shared/infrastructure/database/mongo.connection';
import { apiRouter } from './shared/infrastructure/http/api.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`[SERVER] Сервер запущено на http://localhost:${PORT}`);
});