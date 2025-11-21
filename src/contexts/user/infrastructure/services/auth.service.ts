import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async comparePasswords(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }

    generateToken(payload: object): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET not set');
        return jwt.sign(payload, secret, { expiresIn: '1d' });
    }
}