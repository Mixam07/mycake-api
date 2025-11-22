import { IUserRepository } from "../../domain/repositories/i-user.repository";

export class GetUserByIdUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(id: string) {
        const user = await this.userRepository.findById(id);

        return user;
    }
}