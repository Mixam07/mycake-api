import { Request, Response } from 'express';
import { UserResponseDTO } from '../dtos/user.dto';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';

export class UserController {
    constructor(
        private getUsersUseCase: GetUsersUseCase,
    ) {}

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.getUsersUseCase.execute(req.body);
            
            res.status(201).json({
                users: users?.map(user => UserResponseDTO.fromEntity(user))
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}