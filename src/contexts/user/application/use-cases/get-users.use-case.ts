import { UserRole } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/i-user.repository";

export class GetUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(role?: UserRole, page: number = 1, limit: number = 10) {
        const safeLimit = limit > 100 ? 100 : limit;

        return this.userRepository.find(role, page, safeLimit);
    }
}