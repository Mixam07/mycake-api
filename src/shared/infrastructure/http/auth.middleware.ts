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
    const token = req.cookies['auth_token']; 
  
    if (!token) {
        return res.status(401).json({ message: 'Неавторизовано' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
        
        req.user = payload; 
        
        next();
    } catch (error) {
        res.status(403).json({ message: 'Доступ заборонено: Недійсний токен' });
    }
};