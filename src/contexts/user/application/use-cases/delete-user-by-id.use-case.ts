import { IAuthRepository } from "../../../auth/domain/repositories/i-auth.repository";
import { IUserRepository } from "../../domain/repositories/i-user.repository";

export class DeleteUserByIdUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authRepository: IAuthRepository
    ) {}

    async execute(id: string) {
        const userToDelete = await this.userRepository.findById(id);

        if (!userToDelete) {
            return null;
        }

        await Promise.all([
            this.userRepository.deleteById(id),
            this.authRepository.deleteById(id)
        ]);

        return userToDelete;
    }
}