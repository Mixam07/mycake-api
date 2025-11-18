import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('X-API-KEY');
    const serverApiKey = process.env.API_KEY;

    if (!serverApiKey) {
        return res.status(500).json({ message: 'Помилка конфігурації сервера: API_KEY не встановлено' });
    }

    if (apiKey === serverApiKey) {
        next();
    } else {
        res.status(401).json({ message: 'Доступ заборонено: Невірний API-ключ' });
    }
};

interface AuthPayload {
    id: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const checkAuthToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Доступ заборонено: Токен не надано' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({ message: 'Помилка конфігурації сервера: JWT_SECRET не встановлено' });
    }

    try {
        const payload = jwt.verify(token, jwtSecret) as AuthPayload;
        
        req.user = payload;
        
        next();
    } catch (error) {
        res.status(403).json({ message: 'Доступ заборонено: Недійсний токен' });
    }
};