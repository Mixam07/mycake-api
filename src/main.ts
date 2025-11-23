import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './shared/infrastructure/database/mongo.connection';
import { apiRouter } from './shared/infrastructure/http/api.router';
import { logger } from './shared/infrastructure/logging/logger.service';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api', apiRouter);

app.listen(PORT, () => {
    //logger.log(`[SERVER] Сервер запущено на http://localhost:${PORT}`);
});