import mongoose from 'mongoose';
import { logger } from '../logging/logger.service';

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI не знайдено в .env');
        }
        
        await mongoose.connect(mongoUri);
        logger.log('[DATABASE] Успішно підключено до MongoDB');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
            
        logger.error(`[DATABASE] Помилка підключення. Деталі: ${errorMessage}`);
        process.exit(1);
    }
};