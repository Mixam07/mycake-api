import { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { IUserRepository } from '../../../user/domain/repositories/i-user.repository';
import { AuthService } from '../../infrastructure/services/auth.service';
import { LoginDto } from '../../presentation/dtos/auth.dto';

export class LoginUseCase {
    constructor(
        private readonly authRepository: IAuthRepository,
        private readonly userRepository: IUserRepository,
        private readonly authService: AuthService
    ) {}

    async execute(dto: LoginDto) {
        const credential = await this.authRepository.findByEmail(dto.email);
        if (!credential) {
            throw new Error('Неправильний email або пароль');
        }

        const isValid = await this.authService.comparePasswords(dto.password, credential.passwordHash);
        if (!isValid) {
            throw new Error('Неправильний email або пароль');
        }

        const user = await this.userRepository.findById(credential.id);
        if (!user) {
            throw new Error('Профіль користувача не знайдено');
        }

        const token = await this.authService.generateToken({ 
            id: user.id, 
            email: user.email, 
            role: user.role 
        });

        return {
            user, token
        };
    }
}