import { Response } from 'express';

export class CookieService {
    private readonly cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 24 * 60 * 60 * 1000, // 1 день
    };

    public setAuthCookie(res: Response, token: string): void {
        res.cookie('auth_token', token, this.cookieOptions);
    }

    public clearAuthCookie(res: Response): void {
        res.clearCookie('auth_token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
    }
}