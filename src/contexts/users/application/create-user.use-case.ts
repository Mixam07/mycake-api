import { IUserRepository } from '../domin/i-user.repository';
import { IUser } from '../domin/user.model';
import jwt from 'jsonwebtoken';

interface CreateUserInputDTO {
    name: string;
    email: string;
    password: string;
    role: 'Buyer' | 'Seller';
}

interface CreateUserOutputDTO {
    user: IUser,
    token: string
}

export class CreateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    public async execute(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
        const existingUser = await this.userRepository.findByEmail(input.email);

        if (existingUser) {
            throw new Error('Користувач з таким email вже існує');
        }
        
        if (input.password.length < 8) {
            throw new Error('Пароль повинен містити більше 8 символів');
        }

        const user = await this.userRepository.create(input);

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET не встановлено в .env');
            throw new Error('Помилка конфігурації сервера');
        }

        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: user.role
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