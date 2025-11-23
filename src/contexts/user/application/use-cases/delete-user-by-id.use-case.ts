import { IAuthRepository } from "../../../auth/domain/repositories/i-auth.repository";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/i-user.repository";

export class DeleteUserByIdUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authRepository: IAuthRepository
    ) {}

    async execute(userId: string): Promise<User | null> {
        const userToDelete = await this.userRepository.findById(userId);

        if (!userToDelete) {
            return null;
        }

        await Promise.all([
            this.userRepository.deleteById(userId),
            this.authRepository.deleteById(userId)
        ]);

        return userToDelete;
    }
}