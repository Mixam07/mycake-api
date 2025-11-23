import { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { IUserRepository } from '../../../user/domain/repositories/i-user.repository';
import { User } from '../../../user/domain/entities/user.entity';
import { Auth } from '../../domain/entities/auth.entity';

import { AuthService } from '../../infrastructure/services/auth.service';
import { PasswordStrengthService } from '../../domain/services/password-strength.service';
import { CreateAuthDto } from '../../presentation/dtos/auth.dto';

import mongoose from 'mongoose';

export class RegisterUseCase {
    constructor(
        private authRepo: IAuthRepository,
        private userRepo: IUserRepository,
        private authService: AuthService,
        private passwordService: PasswordStrengthService
    ) {}

    async execute(dto: CreateAuthDto) {
        if (!this.passwordService.isStrong(dto.password)) {
            throw new Error('Пароль занадто слабкий (має бути 8+ символів, A-Z, 0-9)');
        }

        const existsInAuth = await this.authRepo.findByEmail(dto.email);
        const existsInUser = await this.userRepo.findByEmail(dto.email);

        if (existsInAuth || existsInUser) {
            throw new Error('Користувач з таким email не існує');
        }

        const sharedId = new mongoose.Types.ObjectId().toString();

        const hashedPassword = await this.authService.hashPassword(dto.password);

        const auth = new Auth(sharedId, dto.email, hashedPassword);
        const user = new User(sharedId, dto.name, dto.email, dto.role);

        await this.authRepo.save(auth);
        await this.userRepo.save(user);

        this.authService.generateToken({ 
            id: sharedId,
            email: dto.email,
            role: dto.role
        });

        return user;
    }
}