import { IUserRepository } from '../domin/i-user.repository';
import { IUser, UserRole } from '../domin/user.model';

export class GetUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(role?: UserRole): Promise<IUser[]> {
        const users = await this.userRepository.find(role);

        return users;
    }
}