import { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { IUserRepository } from '../../../user/domain/repositories/i-user.repository';
import { AuthService } from '../../infrastructure/services/auth.service';
import { LoginDto } from '../../presentation/dtos/auth.dto';

export class LoginUseCase {
    constructor(
        private authRepo: IAuthRepository,
        private userRepo: IUserRepository,
        private authService: AuthService
    ) {}

    async execute(dto: LoginDto) {
        const credential = await this.authRepo.findByEmail(dto.email);
        if (!credential) {
            throw new Error('Неправильний email або пароль');
        }

        const isValid = await this.authService.comparePasswords(dto.password, credential.passwordHash);
        if (!isValid) {
            throw new Error('Неправильний email або пароль');
        }

        const userProfile = await this.userRepo.findById(credential.id);
        if (!userProfile) {
            throw new Error('Профіль користувача не знайдено');
        }

        const token = this.authService.generateToken({ 
            id: userProfile.id, 
            email: userProfile.email, 
            role: userProfile.role 
        });

        return { user: userProfile, token };
    }
}