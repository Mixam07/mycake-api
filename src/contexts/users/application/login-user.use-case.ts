import { logger } from '../../../shared/infrastructure/logging/logger.service';
import { IUserRepository } from '../domin/i-user.repository';
import { IUser } from '../domin/user.model';
import jwt from 'jsonwebtoken';

interface LoginUserInputDTO {
    email: string;
    password: string;
}

interface LoginUserOutputDTO {
    user: IUser;
    token: string;
}

export class LoginUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    public async execute(input: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
        const user = await this.userRepository.validateCredentials(
            input.email,
            input.password
        );

        if (!user) {
            throw new Error('Неправильний email або пароль');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger.error('JWT_SECRET не встановлено в .env');
            throw new Error('Помилка конфігурації сервера');
        }
        
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: user.role,
            },
            jwtSecret,
            { expiresIn: '1d' }
        );

        return {
            user: user,
            token: token
        };
    }
}