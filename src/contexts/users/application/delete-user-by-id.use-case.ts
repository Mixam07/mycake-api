import { IUserRepository } from '../domin/i-user.repository';
import { IUser } from '../domin/user.model';

export class DeleteUserByIdUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(id: string): Promise<IUser | null> {
        const deletedUser = await this.userRepository.deleteById(id);

        return deletedUser;
    }
}