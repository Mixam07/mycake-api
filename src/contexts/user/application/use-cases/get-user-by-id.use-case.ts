import { IUserRepository } from '../../domain/repositories/i-user.repository';
import { User } from '../../domain/entities/user.entity';

export class GetUserByIdUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(id: string): Promise<User | null> {
        return this.userRepo.findById(id);
    }
}