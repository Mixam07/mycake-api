import { UserRole } from "../../domain/entities/user.type";
import { IUserRepository, PaginatedUsers } from "../../domain/repositories/i-user.repository";

export class GetUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(role?: UserRole, page: number = 1, limit: number = 10): Promise<PaginatedUsers> {
        const safeLimit = limit > 100 ? 100 : limit;

        const users = await this.userRepository.find(role, page, safeLimit);

        return users;
    }
}