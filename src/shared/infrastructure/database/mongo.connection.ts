import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI не знайдено в .env');
        }
        
        await mongoose.connect(mongoUri);
        console.log('[DATABASE] Успішно підключено до MongoDB');
    } catch (error) {
        console.error('[DATABASE] Помилка підключення:', error);
        process.exit(1);
    }
};