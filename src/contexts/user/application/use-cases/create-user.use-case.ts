import { IUserRepository } from '../../domain/repositories/i-user.repository';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../../presentation/dtos/user.dto';
import { AuthService } from '../../infrastructure/services/auth.service';
import mongoose from 'mongoose';

export class CreateUserUseCase {
    constructor(
        private userRepo: IUserRepository,
        private authService: AuthService
    ) {}

    async execute(dto: CreateUserDto): Promise<{ user: User; token: string }> {
        const exists = await this.userRepo.findByEmail(dto.email);
        if (exists) throw new Error('User exists');

        const hashedPassword = await this.authService.hashPassword(dto.password);

        const newId = new mongoose.Types.ObjectId().toString();
        
        const newUser = new User(
            newId,
            dto.name,
            dto.email,
            hashedPassword,
            dto.role
        );

        await this.userRepo.save(newUser);

        const token = this.authService.generateToken({ 
            id: newUser.id, 
            email: newUser.email, 
            role: newUser.role 
        });

        return { user: newUser, token };
    }
}