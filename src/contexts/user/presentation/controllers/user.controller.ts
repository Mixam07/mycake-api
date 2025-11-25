import { Request, Response } from 'express';
import { UserResponseDTO } from '../dtos/user.dto';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { DeleteUserByIdUseCase } from '../../application/use-cases/delete-user-by-id.use-case';
import { UserRole } from '../../domain/entities/user.type';
import { GetPastryByConfectionerUseCase } from '../../application/use-cases/get-pastry-by-confectioner.use-case';
import { PastryResponseDto } from '../../../pastry/presentation/dtos/pastry.dto';

export class UserController {
    constructor(
        private readonly getUsersUseCase: GetUsersUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly deleteUserByIdUseCase: DeleteUserByIdUseCase,
        private readonly getPastryByConfectionerCase: GetPastryByConfectionerUseCase,
    ) {}

    async getUsers(req: Request, res: Response) {
        try {
            const role = req.query.role as UserRole | undefined;
      
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            if (role && role !== 'Buyer' && role !== 'Seller') {
                return res.status(400).json({ message: 'Invalid role' });
            }

            const { users, total } = await this.getUsersUseCase.execute(role, page, limit);
            
            res.status(200).json({
                data: UserResponseDTO.fromEntities(users),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id;

            const user = await this.getUserByIdUseCase.execute(userId);

            if (!user) {
                return res.status(404).json({ message: 'Користувача не знайдено' });
            }

            const response = UserResponseDTO.fromEntity(user);
            
            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getPastriesByConfectioner(req: Request, res: Response) {
        try {
            const confectionerId = req.params.id;

            const pastries = await this.getPastryByConfectionerCase.execute(confectionerId);

            const response = PastryResponseDto.fromEntities(pastries)
            
            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteUserById(req: Request, res: Response) {
        try{
            const id = req.params.id;

            const user = await this.deleteUserByIdUseCase.execute(id);

            if (!user) {
                return res.status(404).json({ message: 'Користувача не знайдено' });
            }

            const response = UserResponseDTO.fromEntity(user);

            res.status(200).json(response)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
}