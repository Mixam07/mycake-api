import { Request, Response } from 'express';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { UserResponseDTO } from '../../../user/presentation/dtos/user.dto';

export class AuthController {
    constructor(
        private registerUseCase: RegisterUseCase,
        private loginUseCase: LoginUseCase
    ) {}

    async register(req: Request, res: Response) {
        try {
            const { user, token } = await this.registerUseCase.execute(req.body);

            res.status(201).json({
                user: UserResponseDTO.fromEntity(user),
                token
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { user, token } = await this.loginUseCase.execute(req.body);
            
            res.status(200).json({
                user: UserResponseDTO.fromEntity(user),
                token
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}