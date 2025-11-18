import { IUserRepository } from '../domin/i-user.repository';
import { IUser } from '../domin/user.model';

export class GetUserByIdUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(id: string): Promise<IUser | null> {
        const user = await this.userRepository.findById(id);

        return user;
    }
}