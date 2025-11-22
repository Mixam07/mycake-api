import { Request, Response } from 'express';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { UserResponseDTO } from '../../../user/presentation/dtos/user.dto';
import { CookieService } from '../../../../shared/infrastructure/http/cookie.service';

export class AuthController {
    constructor(
        private registerUseCase: RegisterUseCase,
        private loginUseCase: LoginUseCase,
        private cookieService: CookieService
    ) {}

    async register(req: Request, res: Response) {
        try {
            const { user, token } = await this.registerUseCase.execute(req.body);

            this.cookieService.setAuthCookie(res, token);

            const response = UserResponseDTO.fromEntity(user);

            res.status(201).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { user, token } = await this.loginUseCase.execute(req.body);

            this.cookieService.setAuthCookie(res, token);

            const response = UserResponseDTO.fromEntity(user);
            
            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            this.cookieService.clearAuthCookie(res);
    
            return res.status(200).json({ message: 'Вихід успішний' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}