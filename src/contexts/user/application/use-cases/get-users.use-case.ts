import { UserRole } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/i-user.repository";

export class GetUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(role?: UserRole) {
        const users = await this.userRepository.find(role);

        return users;
    }
}