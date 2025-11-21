import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UserResponseDTO } from '../dtos/user.dto';

export class UserController {
    constructor(
        private createUserUseCase: CreateUserUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase
    ) {}

    async register(req: Request, res: Response) {
        try {
            const { user, token } = await this.createUserUseCase.execute(req.body);
            
            res.status(201).json({
                user: UserResponseDTO.fromEntity(user),
                token
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getMe(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const user = await this.getUserByIdUseCase.execute(userId);
            
            if (!user) return res.status(404).json({ message: 'Not found' });

            res.json(UserResponseDTO.fromEntity(user));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}